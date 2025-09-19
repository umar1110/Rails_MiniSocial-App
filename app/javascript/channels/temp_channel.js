import consumer from "channels/consumer"

consumer.subscriptions.create("TempChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
    console.log("Connected to TempChannel");
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
    console.log("Disconnected from TempChannel");
  },

  received(data) {
    // Called when there's incoming data on the websocket for this channel
    console.log("Received data from TempChannel", data);
    
  }
});
