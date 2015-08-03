import json
from tornado import testing

from qotr.server import make_application
from qotr.channels import Channels

class TestChannelHandler(testing.AsyncHTTPTestCase):
    '''
    Test the channel creation handler.
    '''

    port = None
    application = None

    def get_app(self):
        Channels.reset()
        return make_application()

    def test_create(self):
        salt = "common"
        channel_id = "test-channel"

        body = "&".join([
            "id={channel_id}",
            "salt={salt}",
        ]).format(**locals())

        response = json.loads(self.fetch(
            '/c/new', method='POST',
            body=body
        ).body.decode('utf8'))

        self.assertEqual({
            "salt": salt,
            "id": channel_id
        }, response)

        channel = Channels.get(channel_id)
        self.assertEqual(salt, channel.salt)


    def test_confict(self):
        body = "&".join([
            "id=test-channel",
            "salt=common",
        ])

        self.fetch('/c/new', method='POST', body=body)
        response = json.loads(self.fetch(
            '/c/new', method='POST',
            body=body
        ).body.decode('utf8'))

        self.assertTrue("error" in response)
