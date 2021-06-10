

module.exports = function make_need_part() {
  return async function need_part(msg) {
    return {x:22,y:msg.y}
  }
}
