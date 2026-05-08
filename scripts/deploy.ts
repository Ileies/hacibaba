import { $ } from 'execa';
import { access, writeFile } from 'fs/promises';

const APP_NAME = 'hacibaba';
const SSH_HOST = process.env.DEPLOY_SSH_HOST ?? 'hosting230274@hacibaba1988.de';
const REMOTE_DIR = process.env.DEPLOY_REMOTE_DIR ?? '/hacibaba1988.de';
const ENV_FILE = process.env.DEPLOY_ENV_FILE ?? '.env';
const BUILD_DIR = process.env.DEPLOY_BUILD_DIR ?? 'build';
const LOCAL_ARCHIVE = `./${APP_NAME}-build.tar.gz`;
const REMOTE_ARCHIVE = `/tmp/${APP_NAME}-build.tar.gz`;
const REMOTE_BACKUP_DIR = `/tmp/${APP_NAME}-deploy-backup`;

function quote(value: string) {
	return `'${value.replaceAll("'", "'\\''")}'`;
}

function validateConfig() {
	if (!SSH_HOST.trim()) throw new Error('DEPLOY_SSH_HOST is empty');
	if (!REMOTE_DIR.trim() || REMOTE_DIR === '/') throw new Error('DEPLOY_REMOTE_DIR is unsafe');
	if (!ENV_FILE.trim()) throw new Error('DEPLOY_ENV_FILE is empty');
}

async function assertFileExists(path: string, label: string) {
	try {
		await access(path);
	} catch {
		throw new Error(`${label} not found at ${path}`);
	}
}

async function remote(command: string) {
	await $`ssh ${SSH_HOST} ${command}`;
}

try {
	validateConfig();
	await assertFileExists(`${BUILD_DIR}/index.js`, 'Build output');
	await assertFileExists(ENV_FILE, 'Environment file');

	console.log('Preparing build directory...');
	await writeFile(
		`${BUILD_DIR}/app.js`,
		"try { process.loadEnvFile('.env'); } catch {}\nimport('./index.js');\n"
	);
	await writeFile(
		`${BUILD_DIR}/package.json`,
		JSON.stringify({ type: 'module', dependencies: { 'better-sqlite3': '>=12' } }, null, 2) + '\n'
	);

	const SERVER_NODE_VERSION = process.env.DEPLOY_NODE_VERSION ?? '25.9.0';

	console.log('Installing native dependencies...');
	await $({
		cwd: BUILD_DIR,
		env: {
			...process.env,
			npm_config_platform: 'linux',
			npm_config_arch: 'x64',
			npm_config_target: SERVER_NODE_VERSION
		}
	})`npm install --omit=dev`;

	console.log('Compressing build directory...');
	await $`tar -czf ${LOCAL_ARCHIVE} -C ${BUILD_DIR} .`;

	console.log('Uploading compressed build...');
	await $`scp ${LOCAL_ARCHIVE} ${SSH_HOST}:${REMOTE_ARCHIVE}`;

	console.log('Saving database...');
	await remote(
		`rm -rf ${quote(REMOTE_BACKUP_DIR)} && mkdir -p ${quote(REMOTE_DIR)} ${quote(REMOTE_BACKUP_DIR)}`
	);
	await remote(
		`for file in db.sqlite db.sqlite-wal db.sqlite-shm; do if [ -e ${quote(REMOTE_DIR)}/"$file" ]; then cp ${quote(REMOTE_DIR)}/"$file" ${quote(REMOTE_BACKUP_DIR)}/"$file"; fi; done`
	);

	console.log('Saving backups directory...');
	await remote(
		`rm -rf ${quote(REMOTE_BACKUP_DIR)}/backups && if [ -d ${quote(REMOTE_DIR)}/backups ]; then cp -r ${quote(REMOTE_DIR)}/backups ${quote(REMOTE_BACKUP_DIR)}/backups; fi`
	);

	console.log('Cleaning remote directory...');
	await remote(
		`find ${quote(REMOTE_DIR)} -mindepth 1 -maxdepth 1 ! -name backups -exec rm -rf {} +`
	);

	console.log('Extracting build on server...');
	await remote(`tar -xzf ${quote(REMOTE_ARCHIVE)} -C ${quote(REMOTE_DIR)}`);

	console.log('Restoring database...');
	await remote(
		`for file in db.sqlite db.sqlite-wal db.sqlite-shm; do if [ -e ${quote(REMOTE_BACKUP_DIR)}/"$file" ]; then mv ${quote(REMOTE_BACKUP_DIR)}/"$file" ${quote(REMOTE_DIR)}/"$file"; fi; done`
	);

	console.log('Restoring backups directory...');
	await remote(
		`if [ -d ${quote(REMOTE_BACKUP_DIR)}/backups ]; then rm -rf ${quote(REMOTE_DIR)}/backups && mv ${quote(REMOTE_BACKUP_DIR)}/backups ${quote(REMOTE_DIR)}/backups; fi`
	);

	console.log('Uploading environment file...');
	await $`scp ${ENV_FILE} ${SSH_HOST}:${REMOTE_DIR}/.env`;

	console.log('Cleaning up temporary files...');
	await remote(`rm -rf ${quote(REMOTE_ARCHIVE)} ${quote(REMOTE_BACKUP_DIR)}`);
	await $`rm -f ${LOCAL_ARCHIVE}`;

	console.log('Restarting application...');
	await remote(
		`mkdir -p ${quote(REMOTE_DIR + '/tmp')} && touch ${quote(REMOTE_DIR + '/tmp/restart.txt')}`
	);

	console.log('Deployment completed successfully!');
} catch (error) {
	console.error('Deployment failed:', error instanceof Error ? error.message : String(error));
	await $`rm -f ${LOCAL_ARCHIVE}`;
}
