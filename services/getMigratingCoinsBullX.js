// getMigratingCoinsBullX.js
const WebSocket = require("ws");
const EventEmitter = require("events");
const {printCoinInfo} = require('../utils/processAnalytics');
require("dotenv").config();

// WebSocket configuration
const WS_URL = process.env.WS_BULLX_MIGRATING_COINS;
const BULLX_EVENT = process.env.BULLX_EVENT
const WS_HEADERS = {
  "accept-language": "en-US,en;q=0.9,fr;q=0.8",
  "cache-control": "no-cache",
  pragma: "no-cache",
  "sec-websocket-extensions": "permessage-deflate; client_max_window_bits",
  "sec-websocket-version": "13",
  Origin: "https://bullx.io",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
};

// Event Emitter for WebSocket
class WebSocketHandler extends EventEmitter {
  constructor() {
    super();
    this.ws = null;
    this.setc = new Set();
  }

  connect() {
    this.ws = new WebSocket(WS_URL, { headers: WS_HEADERS });
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.ws.on("open", () => this.handleOpen());
    this.ws.on("message", (data) => this.handleMessage(data));
    this.ws.on("error", (error) => this.handleError(error));
    this.ws.on("close", (code, reason) => this.handleClose(code, reason));
  }

  handleOpen() {
    console.log("Connected to WebSocket server");
    const subscribeMessage = {
      event: "pusher:subscribe",
      data: {
        channel: BULLX_EVENT,
      },
    };
    this.ws.send(JSON.stringify(subscribeMessage));
  }

  handleMessage(data) {
    try {
      const parsedData = JSON.parse(data.toString());

      if (parsedData.event === BULLX_EVENT) {
        const elements = JSON.parse(parsedData.data);

        elements.forEach((element) => {
          if (
            (element.z === "PUMP") &&
            element.ac === 100
          ) {
            if (!this.setc.has(element.a)) {
              this.setc.add(element.a);
              const logMessage = printCoinInfo(element);

              // Emit an event with the new coin address and log message
              this.emit("newCoin", { mintAddress: element.a, logMessage });
            }
          }
        });
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  }

  handleError(error) {
    console.error("WebSocket error:", error);
  }

  handleClose(code, reason) {
    console.log("Connection closed:", code, reason?.toString());
    // Attempt reconnection after 3 seconds
    setTimeout(() => {
      console.log("Reconnecting to WebSocket...");
      this.connect();
    }, 3000);
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

module.exports = WebSocketHandler;