import { exec, spawn } from "node:child_process";
import { platform } from "node:os";
import { promisify } from "node:util";
import { resolve } from "node:path";

const execAsync = promisify(exec);

async function installSqlFluff(): Promise<void> {
	try {
		// Check if sqlfluff is already installed
		await execAsync("sqlfluff --version");
		console.log("sqlfluff is already installed.");
		return;
	} catch {
		console.log("Installing sqlfluff...");

		let command: string;

		if (platform() === "win32") {
			// Check if py launcher is available on Windows
			try {
				await execAsync("py --version");
				command = "py -m pip install sqlfluff";
			} catch {
				command = "pip install sqlfluff";
			}
		} else {
			command = "pip install sqlfluff";
		}

		try {
			const { stdout, stderr } = await execAsync(command);
			console.log(stdout);
			if (stderr) console.error(stderr);
			console.log("sqlfluff installed successfully.");
		} catch (error) {
			throw new Error(`Failed to install sqlfluff: ${error}`);
		}
	}
}

// Run the installation
try {
	await installSqlFluff();

	console.log("Process completed successfully.");
} catch (error) {
	console.error("An error occurred:", error);
}

// add SQLFluff logic here, for example:

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
sqlfluff.on("close", (code) => {
	process.exit(code);
});
