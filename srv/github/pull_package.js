
module.exports = function make_pull_package() {
  return async function pull_package(msg) {
    return {x:22,y:msg.y}
  }
}
