#! /usr/bin/env node

const { exec, spawn } = require("node:child_process");
const { platform } = require("node:os");
const { promisify } = require("node:util");
const { resolve } = require("node:path");

const execAsync = promisify(exec);

const tryExec = async (command: string) => {
	try {
		await execAsync(command);
		return true;
	} catch {
		return false;
	}
};

async function installSqlFluff() {
	if (await tryExec("sqlfluff --version")) {
		console.log("sqlfluff is already installed.");
		return null;
	}
	console.log("Installing sqlfluff...");

	let command = "pip install sqlfluff";

	if (platform() === "win32") {
		// Check if py launcher is available on Windows
		try {
			await execAsync("py --version");
			command = "py -m pip install sqlfluff";
		} catch {
			command = "pip install sqlfluff";
		}
	}

	return await execAsync(command);
}

(async () => {
	const result = await installSqlFluff();
	if (result) {
		console.log(result.stdout);
		if (result.stderr) {
			console.error(result.stderr);
		}
		console.log("sqlfluff installed successfully.");
	}

	// Remove the first two arguments (node executable and script path)
	const args = process.argv.slice(2);

	// Resolve file/directory paths to absolute paths
	const resolvedArgs = args.map((arg) => {
		// Check if the argument looks like a file path (not starting with '-')
		if (!arg.startsWith("-") && !arg.startsWith("--")) {
			return resolve(process.cwd(), arg);
		}
		return arg;
	});

	// Spawn SQLFluff process
	const sqlfluff = spawn("sqlfluff", resolvedArgs, { stdio: "inherit" });

	// Handle process exit
	sqlfluff.on("close", (code: string) => {
		process.exit(code);
	});
})();
