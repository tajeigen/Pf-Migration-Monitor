const MTProto = require("@mtproto/core");
const path = require("path");
const config = require('../config/config');


// Configuration
const { apiId, apiHash, phoneNumber } = config.telegram;
// Initialize MTProto
const mtproto = new MTProto({
  apiId,
  apiHash,
  storageOptions: {
    path: path.resolve(__dirname, "./telegram_sessions/session.json"),
  },
});

// Send Code for Authentication
const sendCode = async () => {
  try {
    const result = await mtproto.call("auth.sendCode", {
      phoneNumber,
      settings: {
        _: "codeSettings",
      },
    });
    return result;
  } catch (error) {
    if (error.error_code === 303 && error.error_message.includes("PHONE_MIGRATE")) {
      const dcId = parseInt(error.error_message.split("_").pop(), 10);
      mtproto.setDefaultDc(dcId);
      await sleep(3000);
      return sendCode();
    } else {
      throw error;
    }
  }
};

// Sign In After Receiving the Code
const signIn = async (code, phone_code_hash) => {
  try {
    const result = await mtproto.call("auth.signIn", {
      phoneNumber,
      phone_code_hash,
      phone_code: code,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

// Get Channel Information by Username or ID
const getChannelInfo = async (channelId) => {
  try {
    const dialogs = await mtproto.call("messages.getDialogs", {
      offset_date: 0,
      offset_id: 0,
      offset_peer: { _: "inputPeerEmpty" },
      limit: 100,
      hash: 0,
    });

    const channel = dialogs.chats.find((chat) => chat.id === channelId);
    if (!channel) {
      throw new Error("Channel not found in dialogs.");
    }

    return {
      chat_id: channel.id,
      access_hash: channel.access_hash,
    };
  } catch (error) {
    throw error;
  }
};

// Send a Message to a Channel
const sendMessageToChannel = async (chat_id, access_hash, messageText) => {
  try {
    await mtproto.call("messages.sendMessage", {
      peer: {
        _: "inputPeerChannel",
        channel_id: chat_id,
        access_hash: access_hash,
      },
      message: messageText,
      random_id: Math.floor(Math.random() * 1000000),
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  sendCode,
  signIn,
  getChannelInfo,
  sendMessageToChannel,
};