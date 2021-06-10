
module.exports = function make_collect_part() {
  return async function collect_part(msg) {
    return {x:1,y:msg.y}
  }
}
