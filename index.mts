import {exec, spawn} from "node:child_process";
import {platform} from "node:os";
import {promisify} from "node:util";
import {resolve} from "node:path";

const execAsync = promisify(exec);

const tryExec = async (command: string): Promise<boolean> => {
    try {
        await execAsync(command);
        return true;
    } catch {
        return false;
    }
}

async function installSqlFluff(): Promise<{ stdout: string; stderr: string } | null> {
    if (await tryExec("sqlfluff --version")) {
        console.log("sqlfluff is already installed.");
        return null;
    }
    console.log("Installing sqlfluff...");

    let command: string = "pip install sqlfluff"

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
const sqlfluff = spawn("sqlfluff", resolvedArgs, {stdio: "inherit"});

// Handle process exit
sqlfluff.on("close", (code) => {
    process.exit(code);
});
