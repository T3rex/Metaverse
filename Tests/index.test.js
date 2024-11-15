const axios2 = require("axios");

const BACKEND_URL = "http://localhost:3000";
const WEBSOCKET_URL = "http://localhost:3001";

const axios = {
  get: async (...args) => {
    try {
      const response = await axios2.get(...args);
      return response;
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  },

  post: async (...args) => {
    try {
      const response = await axios2.post(...args);
      return response;
    } catch (error) {
      return error.response;
    }
  },
  delete: async (...args) => {
    try {
      const response = await axios2.delete(...args);
      return response;
    } catch (error) {
      return error.response;
    }
  },
  put: async (...args) => {
    try {
      const response = await axios2.put(...args);
      return response;
    } catch (error) {
      return error.response;
    }
  },
  patch: async (...args) => {
    try {
      const response = await axios2.patch(...args);
      return response;
    } catch (error) {
      return error.response;
    }
  },
};

async function setupHTTP() {
  const username = "Aditya" + Math.random() * 100;
  const password = "password";
  const adminSignUpResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
    username,
    password,
    role: "admin",
  });
  adminId = adminSignUpResponse.data.userId;
  const adminSignInresponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
    username,
    password,
  });
  adminToken = adminSignInresponse.data.token;

  const userSignUpResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
    username: username + "-user",
    password,
    role: "user",
  });
  userId = userSignUpResponse.data.userId;
  const userSignInresponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
    username: username + "-user",
    password,
  });
  userToken = userSignInresponse.data.token;

  const element1 = await axios.post(
    `${BACKEND_URL}/api/v1/admin/element`,
    {
      imageURL: "image_URL",
      width: 1,
      height: 1,
      static: true,
    },
    {
      header: {
        authorization: `Bearer ${adminToken}`,
      },
    }
  );

  const element2 = await axios.post(
    `${BACKEND_URL}/api/v1/admin/element`,
    {
      imageURL: "image_URL",
      width: 1,
      height: 1,
      static: true,
    },
    {
      header: {
        authorization: `Bearer ${adminToken}`,
      },
    }
  );

  element1Id = element1.id;
  element2Id = element2.id;

  const map = await axios.post(
    `${BACKEND_URL}/api/v1/admin/map`,
    {
      thumbnailURL: "thumbnail_url",
      dimensions: "100x200",
      defaultElements: [
        {
          elementid: element1Id,
          x: 20,
          y: 30,
        },
        {
          elementid: element1Id,
          x: 25,
          y: 35,
        },
        {
          elementid: element2Id,
          x: 23,
          y: 12,
        },
      ],
    },
    {
      header: {
        authorization: `Bearer ${adminToken}`,
      },
    }
  );
  mapId = map.id;
  const spaceResponse = await axios.post(
    `${BACKEND_URL}/api/v1/space`,
    {
      name: "MySpace",
      dimensions: "100x200",
      mapId,
    },
    {
      header: {
        authorization: `Bearer ${userToken}`,
      },
    }
  );
  spaceId = response.spaceId;
}

describe("Authentication", () => {
  test("User is able to sign up only once", async () => {
    const username =
      "Aditya" + Math.floor(Math.random() * 100000) + "@gmail.com";
    const password = "password";
    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      role: "Admin",
    });
    expect(response.status).toBe(200);
    const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      role: "Admin",
    });
    expect(updatedResponse.status).toBe(400);
  });

  test("Signup request fails if username is empty", async () => {
    const username =
      "Aditya" + Math.floor(Math.random() * 100000) + "@gmail.com";
    const password = "password";
    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      password,
      role: "admin",
    });
    expect(response.status).toBe(400);
  });

  test("Signin succeeds if username and password are correct", async () => {
    const username =
      "Aditya" + Math.floor(Math.random() * 100000) + "@gmail.com";
    const password = "password";
    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      role: "Admin",
    });
    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    expect(response.status).toBe(200);
  });

  test("Signin fails if username and password are incorrect", async () => {
    const username =
      "Aditya" + Math.floor(Math.random() * 100000) + "@gmail.com";
    const password = "password";
    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      role: "Admin",
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: "osjoosdfofmwoeifjo",
      password: "ojasnoand",
    });
    expect(response.status).toBe(400);
  });
});

// describe("User Information Endpoints", () => {
//   let avatarId = "";
//   let token = "";
//   let userId = "";
//   beforeAll(async () => {
//     const username = "Aditya" + Math.random() * 100;
//     const password = "password";
//     const signUpResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//       username,
//       password,
//       role: "admin",
//     });
//     userId = signUpResponse.data.userId;
//     const signInresponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
//       username,
//       password,
//     });
//     token = signInresponse.data.token;
//     const avatarResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/avatar`,
//       {
//         imageLink: "link",
//         name: "Jhonny",
//       },
//       {
//         headers: {
//           authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     avatarId = avatarResponse.data.avatarId;
//   });

//   test("User can not update their avatar id with unavailable avatar id", async () => {
//     const response = axios.post(
//       `${BACKEND_URL}/api/v1/user/metadata`,
//       {
//         avatarId: "293842",
//       },
//       {
//         headers: {
//           authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     expect(response.statusCode).toBe(400);
//   });

//   test("User can update their metadata with an available avatar id", async () => {
//     const response = axios.post(
//       `${BACKEND_URL}/api/v1/user/metadata`,
//       {
//         avatarId,
//       },
//       {
//         headers: {
//           authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     expect(response.statusCode).toBe(200);
//   });

//   test("User unable to update metadata if auth head is missing", async () => {
//     const response = axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
//       avatarId,
//     });
//     expect(response.statusCode).toBe(403);
//   });
// });

// describe("User Avatar Information", () => {
//   let avatarId = "";
//   let token = "";
//   let userId = "";
//   beforeAll(async () => {
//     const username = "Aditya" + Math.random() * 100;
//     const password = "password";
//     const signUpResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//       username,
//       password,
//       role: "admin",
//     });
//     userId = signUpResponse.data.userId;
//     const signInresponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
//       username,
//       password,
//     });
//     token = signInresponse.data.token;
//     const avatarResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/avatar`,
//       {
//         imageLink: "link",
//         name: "Jhonny",
//       },
//       {
//         headers: {
//           authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     avatarId = avatarResponse.data.avatarId;
//   });

//   test("Get back avatar information for a user", async () => {
//     const response = await axios.get(
//       `${BACKEND_URL}/api/v1/user/metadata/bulk?ids=${userId}`
//     );
//     expect(response.data.avatars.length).toBe(1);
//     expect(response.data.avatars[0].userId).toBe(userId);
//   });

//   test("Get all available avatars", async () => {
//     const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);
//     expect(response.data.avatars.length).not.toBe(0);
//     const currentAvatar = response.data.avatars.find((x) => x.id == avatarId);
//     expect(currentAvatar).tobeDefined();
//   });
// });

// describe("Space information", () => {
//   let mapId;
//   let element1Id;
//   let element2Id;
//   let adminToken = "";
//   let adminId = "";
//   let userId = "";
//   let userToken = "";
//   beforeAll(async () => {
//     const username = "Aditya" + Math.random() * 100;
//     const password = "password";
//     const adminSignUpResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/signup`,
//       {
//         username,
//         password,
//         role: "admin",
//       }
//     );
//     adminId = adminSignUpResponse.data.userId;
//     const adminSignInresponse = await axios.post(
//       `${BACKEND_URL}/api/v1/signin`,
//       {
//         username,
//         password,
//       }
//     );
//     adminToken = adminSignInresponse.data.token;

//     const userSignUpResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/signup`,
//       {
//         username,
//         password,
//         role: "user",
//       }
//     );
//     userId = userSignUpResponse.data.userId;
//     const userSignInresponse = await axios.post(
//       `${BACKEND_URL}/api/v1/signin`,
//       {
//         username,
//         password,
//       }
//     );
//     userToken = userSignInresponse.data.token;

//     const element1 = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageURL: "image_URL",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         header: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     element1Id = element1.id;

//     const element2 = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageURL: "image_URL",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         header: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     element2Id = element2.id;

//     const map = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/map`,
//       {
//         thumbnailURL: "thumbnail_url",
//         dimensions: "100x200",
//         defaultElements: [
//           {
//             elementid: element1Id,
//             x: 20,
//             y: 30,
//           },
//           {
//             elementid: element1Id,
//             x: 25,
//             y: 35,
//           },
//           {
//             elementid: element2Id,
//             x: 23,
//             y: 12,
//           },
//         ],
//       },
//       {
//         header: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );
//     mapId = map.id;
//   });

//   test("User is able to create a space", async () => {
//     const response = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "MySpace",
//         dimensions: "100x200",
//         mapId,
//       },
//       {
//         header: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );
//     expect(response.spaceId).toBeDefined();
//   });

//   test("User is able to create a space without mapid", async () => {
//     const response = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "MySpace",
//         dimensions: "100x200",
//       },
//       {
//         header: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );
//     expect(response.spaceId).toBeDefined();
//   });

//   test("User is not able to create a space without mapid and dimensions", async () => {
//     const response = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "MySpace",
//       },
//       {
//         header: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );
//     expect(response.statusCode).toBe(400);
//   });

//   test("User is not able to delete a space that is not created", async () => {
//     const response = await axios.delete(
//       `${BACKEND_URL}/api/v1/space/randomIdThatDoesNotExist`,
//       {
//         name: "MySpace",
//       },
//       {
//         header: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );
//     expect(response.statusCode).toBe(400);
//   });

//   test("User is not able to delete a space that is not created", async () => {
//     const response = await axios.delete(
//       `${BACKEND_URL}/api/v1/space/randomIdThatDoesNotExist`,
//       {
//         header: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );
//     expect(response.statusCode).toBe(400);
//   });

//   test("User is not able to delete a space of another user", async () => {
//     const response = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "MySpace",
//         dimensions: "100x200",
//       },
//       {
//         header: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     const deleteResponse = await axios.delete(
//       `${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,
//       {
//         header: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );
//     expect(response.statusCode).toBe(400);
//   });

//   test("Admin has no space initially", async () => {
//     const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
//       headers: { authorization: `Bearer ${adminToken}` },
//     });
//     expect(response.data.spaces.length).toBe(0);
//   });
// });

// describe("Arena Information", () => {
//   let mapId;
//   let element1Id;
//   let element2Id;
//   let adminToken = "";
//   let adminId = "";
//   let userId = "";
//   let userToken = "";
//   let spaceId = "";
//   beforeAll(async () => {
//     setupHTTP();
//   });

//   test("User can access it's own space", async () => {
//     const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
//       header: { authorization: `Bearer ${userToken}` },
//     });
//     expect(response.statusCode).toBe(200);
//     expect(response.data.elements.length).toBe(3);
//   });

//   test("Incorrect spaceid return a 400", async () => {
//     const response = await axios.get(
//       `${BACKEND_URL}/api/v1/space/:incorrectSpaceId`,
//       {
//         header: { authorization: `Bearer ${userToken}` },
//       }
//     );
//     expect(response.statusCode).toBe(400);
//   });
// });

// describe("Websocket tests", () => {
//   let adminToken = "";
//   let adminId = "";
//   let userId = "";
//   let userToken = "";
//   let element1Id = "";
//   let element2Id = "";
//   let mapId = "";
//   let spaceId = "";
//   let ws1;
//   let ws2;
//   let ws1Messages;
//   let ws2Messages;
//   let userX;
//   let userY;
//   let adminX;
//   let adminY;

//   function waitForOrPopLatestMessage(messageArray) {
//     return new Promise((res, rej) => {
//       if (messageArray.length > 0) {
//         res(messageArray.shift());
//       } else {
//         const interval = setInterval(() => {
//           if (messageArray.length > 0) {
//             clearInterval(interval);
//             res(messageArray.shift());
//           }
//         }, 1000);
//       }
//     });
//   }

//   async function setupWebsocket() {
//     ws1 = new WebSocket(WEBSOCKET_URL);

//     await Promise((res, rej) => {
//       ws1.onopen = res;
//     });

//     ws1Messages = (event) => {
//       ws1Messages.push(event.data);
//     };

//     ws2 = new WebSocket(WEBSOCKET_URL);

//     await Promise((res, rej) => {
//       ws2.onopen = res;
//     });

//     ws2Messages = (event) => {
//       ws1Messages.push(event.data);
//     };
//   }

//   beforeAll(() => {
//     setupHTTP();
//     setupWebsocket();
//   });

//   test("Get back ack for joining the space", async () => {
//     ws1.send(
//       JSON.stringify({
//         type: "join",
//         payload: {
//           spaceId: spaceId,
//           token: adminToken,
//         },
//       })
//     );
//     const message1 = await waitForOrPopLatestMessage(ws1Messages);

//     ws2.send(
//       JSON.stringify({
//         type: "join",
//         payload: {
//           spaceId: spaceId,
//           token: userToken,
//         },
//       })
//     );
//     const message2 = await waitForOrPopLatestMessage(ws2Messages);
//     const message3 = await waitForOrPopLatestMessage(ws1Messages);

//     adminX = message1.payload.spawn.x;
//     adminY = message1.payload.spawn.y;

//     userX = message2.payload.spawn.x;
//     userY = message2.payload.spawn.y;

//     expect(message1.type).toBe("space-joined");
//     expect(message2.type).toBe("space-joined");
//     expect(message3.type).toBe("user-join");

//     expect(message1.payload.users.length).toBe(0);
//     expect(message2.payload.users.length).toBe(1);
//     expect(message3.payload.x).toBe(userX);
//     expect(message3.payload.y).toBe(userY);
//     expect(message3.payload.userId).toBe(userId);
//   });

//   test("User should not to able to move ouside boundaries of space", async () => {
//     ws1.send(
//       JSON.stringify({
//         type: "movement",
//         payload: {
//           x: 9238049,
//           y: 293840293,
//         },
//       })
//     );

//     const message1 = await waitForOrPopLatestMessage(ws1Messages);
//     expect(message1.type).toBe("movement-rejected");
//     expect(message1.payload.x).toBe(adminX);
//     expect(message1.payload.y).toBe(adminY);
//   });

//   test("User should not to able to move two blocks at a time", async () => {
//     ws1.send(
//       JSON.stringify({
//         type: "movement",
//         payload: {
//           x: adminX + 2,
//           y: adminY,
//         },
//       })
//     );

//     const message1 = await waitForOrPopLatestMessage(ws1Messages);
//     expect(message1.type).toBe("movement-rejected");
//     expect(message1.payload.x).toBe(adminX);
//     expect(message1.payload.y).toBe(adminY);
//   });

//   test("Correct movement should be broadcasting to the other sockets in the room", async () => {
//     ws1.send(
//       JSON.stringify({
//         type: "movement",
//         payload: {
//           x: adminX + 1,
//           y: adminY,
//           userId: adminId,
//         },
//       })
//     );

//     const message1 = await waitForOrPopLatestMessage(ws2Messages);
//     expect(message1.type).toBe("movement");
//     expect(message1.payload.x).toBe(adminX + 1);
//     expect(message1.payload.y).toBe(adminY);
//   });

//   test("If a user leave then other users should receive a leave event", async () => {
//     ws1.close();

//     const message1 = await waitForOrPopLatestMessage(ws2Messages);
//     expect(message1.type).toBe("user-left");
//     expect(message1.payload.userId).toBe(adminId);
//   });
// });
