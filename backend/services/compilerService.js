const vm = require('vm');
const https = require('https');

/**
 * Piston Remote Code Execution API caller
 */
async function executeRemotePiston(language, sourceCode, inputStr) {
  return new Promise((resolve) => {
    const langMap = {
      javascript: { language: 'javascript', version: '18.15.0' },
      js: { language: 'javascript', version: '18.15.0' },
      python: { language: 'python', version: '3.10.0' },
      cpp: { language: 'cpp', version: '10.2.0' }
    };

    const targetLang = langMap[language.toLowerCase()] || langMap.javascript;

    const data = JSON.stringify({
      language: targetLang.language,
      version: targetLang.version,
      files: [{ content: sourceCode }],
      stdin: inputStr || ''
    });

    const options = {
      hostname: 'emkc.org',
      port: 443,
      path: '/api/v2/piston/execute',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      },
      timeout: 5000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          const stdout = parsed.run ? parsed.run.stdout.trim() : '';
          const stderr = parsed.run ? parsed.run.stderr.trim() : '';
          resolve({ stdout, stderr, code: parsed.run ? parsed.run.code : 1 });
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
    req.on('timeout', () => {
      req.destroy();
      resolve(null);
    });

    req.write(data);
    req.end();
  });
}

/**
 * Local VM JavaScript Fallback Compiler
 */
function executeLocalJS(sourceCode, inputStr) {
  try {
    let output = '';
    const sandbox = {
      console: {
        log: (...args) => {
          output += args.join(' ') + '\n';
        }
      },
      input: inputStr,
      result: null
    };

    const scriptText = `
      ${sourceCode}
      if (typeof solution === 'function') {
        const parsedInput = ${JSON.stringify(inputStr)};
        let args;
        try {
          args = JSON.parse(parsedInput);
          if (!Array.isArray(args)) args = [args];
        } catch(e) {
          args = [parsedInput];
        }
        const res = solution(...args);
        if (res !== undefined) console.log(typeof res === 'object' ? JSON.stringify(res) : res);
      }
    `;

    const context = vm.createContext(sandbox);
    const script = new vm.Script(scriptText);
    script.runInContext(context, { timeout: 2000 });

    return { stdout: output.trim(), stderr: '', code: 0 };
  } catch (err) {
    return { stdout: '', stderr: err.message, code: 1 };
  }
}

/**
 * Execute User Code against all Test Cases in dynamic Problem payload
 */
async function executeCodeAgainstTestCases(language, sourceCode, testCases = []) {
  const startTime = Date.now();
  let passedCount = 0;
  const testResults = [];

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    let runResult = await executeRemotePiston(language, sourceCode, tc.input);

    if (!runResult && (language === 'javascript' || language === 'js')) {
      runResult = executeLocalJS(sourceCode, tc.input);
    }

    if (!runResult) {
      runResult = { stdout: '', stderr: 'Execution service timed out', code: 1 };
    }

    const actualOutput = runResult.stdout ? runResult.stdout.trim() : '';
    const expectedOutput = tc.expectedOutput ? tc.expectedOutput.trim() : '';
    const passed = actualOutput === expectedOutput;

    if (passed) passedCount++;

    testResults.push({
      testCaseIndex: i + 1,
      passed,
      actualOutput: tc.isHidden ? '[HIDDEN]' : actualOutput,
      expectedOutput: tc.isHidden ? '[HIDDEN]' : expectedOutput,
      error: runResult.stderr || null
    });
  }

  const executionTimeMs = Date.now() - startTime;
  const totalCount = testCases.length;
  const failedCount = totalCount - passedCount;
  const hpDamage = failedCount * 20; // 20 HP lost per failed test case
  const isAllPassed = passedCount === totalCount && totalCount > 0;

  return {
    success: isAllPassed,
    passedCount,
    totalCount,
    failedCount,
    hpDamage,
    executionTimeMs,
    testResults,
    logs: `${passedCount}/${totalCount} test cases passed (${executionTimeMs}ms)`
  };
}

module.exports = {
  executeCodeAgainstTestCases
};
