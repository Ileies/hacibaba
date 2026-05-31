import { $ } from 'execa';
import { access, readFile, writeFile } from 'fs/promises';

const SSH_HOST = 'hosting230274@hacibaba1988.de';
const REMOTE_DIR = '/hacibaba1988.de';
const LOCAL_ARCHIVE = `./hacibaba-build.tar.gz`;
const REMOTE_ARCHIVE = `/tmp/hacibaba-build.tar.gz`;

function validateConfig() {
	if (!SSH_HOST.trim()) throw new Error('DEPLOY_SSH_HOST is empty');
	if (!REMOTE_DIR.trim() || REMOTE_DIR === '/') throw new Error('DEPLOY_REMOTE_DIR is unsafe');
}

async function remote(command: string) {
	await $`ssh ${SSH_HOST} ${command}`;
}

try {
	validateConfig();

	try {
		await access('build/index.js');
	} catch {
		throw new Error(`Build output not found at build/index.js`);
	}

	console.log('Preparing build directory...');
	await writeFile(
		`build/app.js`,
		"try { process.loadEnvFile('.env'); } catch {}\nimport('./index.js');\n"
	);
	const rootPkg = JSON.parse(await readFile('package.json', 'utf-8'));
	await writeFile(
		`build/package.json`,
		JSON.stringify({ type: 'module', dependencies: rootPkg.dependencies }, null, 2) + '\n'
	);

	const SERVER_NODE_VERSION = '25.9.0';

	console.log('Installing native dependencies...');
	await $({
		cwd: 'build',
		env: {
			...process.env,
			npm_config_platform: 'linux',
			npm_config_arch: 'x64',
			npm_config_target: SERVER_NODE_VERSION
		}
	})`npm install --omit=dev`;

	console.log('Compressing build directory...');
	await $`tar -czf ${LOCAL_ARCHIVE} -C build .`;

	console.log('Uploading compressed build...');
	await $`scp ${LOCAL_ARCHIVE} ${SSH_HOST}:${REMOTE_ARCHIVE}`;

	console.log('Cleaning remote directory...');
	await remote(`mkdir -p ${REMOTE_DIR}`);
	await remote(`find ${REMOTE_DIR} -mindepth 1 -maxdepth 1 ! -name data -exec rm -rf {} +`);

	console.log('Extracting build on server...');
	await remote(`tar -xzf ${REMOTE_ARCHIVE} -C ${REMOTE_DIR}`);

	console.log('Uploading environment file...');
	await $`scp .env ${SSH_HOST}:${REMOTE_DIR}/.env`;

	console.log('Cleaning up temporary files...');
	await remote(`rm -f ${REMOTE_ARCHIVE}`);
	await $`rm -f ${LOCAL_ARCHIVE}`;

	console.log('Restarting application...');
	await remote(`mkdir -p ${REMOTE_DIR + '/tmp'} && touch ${REMOTE_DIR + '/tmp/restart.txt'}`);

	console.log('Deployment completed successfully!');
} catch (error) {
	console.error('Deployment failed:', error instanceof Error ? error.message : String(error));
	await $`rm -f ${LOCAL_ARCHIVE}`;
}
