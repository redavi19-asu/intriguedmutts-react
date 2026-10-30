import { spawnSync } from 'node:child_process';
function run(command, args, capture = false) {
 const result = spawnSync(command, args, { stdio: capture ? 'pipe' : 'inherit', encoding: 'utf8' });
 if (result.status !== 0) { if (capture) process.stderr.write(result.stderr || result.stdout || 'Command failed'); process.exit(result.status || 1); }
 return result.stdout?.trim();
}
if (run('git', ['status', '--porcelain'], true)) throw new Error('Commit or save changes before releasing.');
run('npm', ['run', 'lint']);
run('npm', ['test']);
run('npm', ['run', 'build']);
run('gh-pages', ['-d', 'dist']);
const dispatched = run('gh', ['workflow', 'run', 'deploy.yml', '--ref', 'gh-pages', '-R', 'redavi19-asu/intriguedmutts-react'], true);
const match = dispatched.match(/actions\/runs\/(\d+)/);
if (!match) throw new Error('Release was dispatched; inspect GitHub Actions for the deployment result.');
process.stdout.write(dispatched + '\n');
run('gh', ['run', 'watch', match[1], '-R', 'redavi19-asu/intriguedmutts-react', '--exit-status', '--interval', '10']);
