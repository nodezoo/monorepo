const Assert = require('assert')
const Seneca = require('seneca')
const TestHelpers = require('../../support/helpers')

const {
  make_seneca,
  register_user,
  login_user,
  register_and_login_user
} = TestHelpers

const make_list_bookmarks = require('../../../srv/user/list_bookmarks')


describe('list bookmarks', () => {
  describe('when the auth token is missing from the msg', () => {
    const seneca = make_seneca()
    const list_bookmarks = make_list_bookmarks()


    it('shall not pass', async () => {
      const res = await list_bookmarks.call(seneca, {})
      expect(res).toEqual({ ok: false, why: 'unauthorized' })
    })
  })


  describe('when the auth token is invalid', () => {
    const seneca = make_seneca()
    const list_bookmarks = make_list_bookmarks()


    it('shall not pass', async () => {
      await register_and_login_user({
        email: 'alice@example.com',
        pass: '012345678'
      }, { seneca })


      const msg = { auth_token: 'aleaiactaest' }
      const res = await list_bookmarks.call(seneca, msg)


      expect(res).toEqual({ ok: false, why: 'unauthorized' })
    })
  })


  describe('when the user has bookmarks', () => {
    const seneca = make_seneca()
    const list_bookmarks = make_list_bookmarks()


    const user_email = 'bob@example.com'
    const user_pass = 'abcdefghij'


    it('returns bookmarks of the user', async () => {
      const { auth_token, user } = await register_and_login_user({
        email: user_email,
        pass: user_pass
      }, { seneca })


      Assert(user.id, 'user.id')
      const { id: user_id } = user

      await seneca.make('nodezoo', 'bookmark')
        .data$({
          owner_id: user_id,
          name: 'seneca-mem-store'
        })
        .save$()

      await seneca.make('nodezoo', 'bookmark')
        .data$({
          owner_id: user_id,
          name: 'seneca-mongo-store'
        })
        .save$()


      const msg = { auth_token }
      const res = await list_bookmarks.call(seneca, msg)


      expect(res).toEqual({
        ok: true,
        data: {
          bookmarks: [
            jasmine.any(Object),
            jasmine.any(Object)
          ]
        }
      })


      const actual_bookmarks = res.data.bookmarks
      const byBookmarkName = (x, y) => x.name.localeCompare(y.name)

      expect([...actual_bookmarks].sort(byBookmarkName))
        .toEqual([
          {
            id: jasmine.any(String),
            name: 'seneca-mem-store',
            owner_id: user_id
          },
          {
            id: jasmine.any(String),
            name: 'seneca-mongo-store',
            owner_id: user_id
          }
        ])
    })
  })


  describe('when other users have bookmarks', () => {
    const seneca = make_seneca()
    const list_bookmarks = make_list_bookmarks()


    const user_email = 'bob@example.com'
    const user_pass = 'abcdefghij'


    it('returns bookmarks of the user', async () => {
      const { auth_token, user } = await register_and_login_user({
        email: user_email,
        pass: user_pass
      }, { seneca })

      const another_user = await register_user({
        email: 'alice@example.com',
        pass: '0123456789'
      }, { seneca })


      Assert(user.id, 'user.id')
      const { id: user_id } = user

      Assert(another_user.id, 'another_user.id')
      const { id: another_user_id } = another_user

      await seneca.make('nodezoo', 'bookmark')
        .data$({
          owner_id: user_id,
          name: 'seneca-mem-store'
        })
        .save$()

      await seneca.make('nodezoo', 'bookmark')
        .data$({
          owner_id: another_user_id,
          name: 'seneca-mongo-store'
        })
        .save$()


      const msg = { auth_token }
      const res = await list_bookmarks.call(seneca, msg)


      expect(res).toEqual({
        ok: true,
        data: {
          bookmarks: [
            {
              id: jasmine.any(String),
              name: 'seneca-mem-store',
              owner_id: user_id
            },
          ]
        }
      })
    })
  })
})

