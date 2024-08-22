

from channels.generic.websocket import WebsocketConsumer



class DefaultConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        # self.send(text_data=json.dumps({
        #     'error': 'Invalid WebSocket path'
        # }))
        # # self.close()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        pass