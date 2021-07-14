
module.exports = function make_test_true() {
  return async function test_true(msg) {
    return {
      ok: true,
      time: Date.now(),
      foo: 111
    }
  }
}
