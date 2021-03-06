import json
import unittest

from qotr.message import Message, MessageTypes
from mock import Mock

from .utils import m

class TestMessage(unittest.TestCase):

    def test_raw_object(self):
        message = Message.from_object(
            m("chat", "test", Mock(nick="test", id="foo"))
        )

        self.assertEqual(m("chat", "test", "foo"), message.as_json())

    def test_object(self):
        message = Message.from_object(
            m(MessageTypes["chat"], "test", Mock(nick="test", id="foo"))
        )

        self.assertEqual(m("chat", "test", "foo"), message.as_json())

    def test_json(self):
        obj = m("chat", "test")
        message = Message.from_json(json.dumps(obj))
        self.assertEqual(obj, message.as_json())
