import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Hello World', () => {
    test('sample testing', async (assert) => {
        /**
         * Make request
         */
        const { body } = await supertest(BASE_URL).get('/').expect(200)

        assert.equal(body.message, 'Hello World')
    })
})
