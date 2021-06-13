
module.exports = function make_search_query() {
  return async function search_query(msg) {
    return {x:22,y:msg.y}
  }
}
