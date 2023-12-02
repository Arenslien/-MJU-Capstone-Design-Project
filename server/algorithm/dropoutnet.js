// // https://stackoverflow.com/questions/44423931/calling-python-script-with-node-js-express-server 참고

// const { spawn } = require("child_process").spawn;

// pyFileDirectory = "../../model/dropout-net/get_recommend_result.py";
// const ls = spawn("python", [pyFileDirectory, "--user-information"].concat(userInformation.map(String)));

// const executeDropoutNet = () => {
  
//   return new Promise((resolve, reject) => {

//     const pythonProcess = exec(, (error, stdout, stderr) => {
//       if (error) {
//         reject(error);
//       }
//       if (stderr) {
//         reject(stderr);
//       }
//       resolve(stdout);
//     });

//   });

// };

// module.exports = {
//   executeDropoutNet
// };