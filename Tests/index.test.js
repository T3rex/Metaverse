const axios = require("axios");

BACKEND_URL = "http://localhost:3000";

describe("Authentication", () => {
  test("User is able to sign up only once", async () => {
    const username = "Aditya" + Math.random() * 100;
    const password = "password";
    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    expect(response.statusCode).toBe(200);
    const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    expect(updatedResponse.statusCode).toBe(400);
  });

  test("Signup request fails if username is empty", async () => {
    const username = "Aditya" + Math.random() * 100;
    const password = "password";
    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      password,
      type: "admin",
    });
    expect(respnse.statusCode).toBe(400);
  });

  test("Signin succeeds if username and password are correct", async () => {
    const username = "Aditya" + Math.random() * 100;
    const password = "password";
    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.token).tobeDefined();
  });

  test("Signin fails if username and password are incorrect", async () => {
    const username = "Aditya" + Math.random() * 100;
    const password = "password";
    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: "osjoosdfofmwoeifjo",
      password: "ojasnoand",
    });
    expect(response.statusCode).toBe(403);
  });
});

describe("User Information Endpoints", () => {
  let avatarId = "";
  let token = "";
  let userId = "";
  beforeAll(async () => {
    const username = "Aditya" + Math.random() * 100;
    const password = "password";
    const signUpResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    userId = signUpResponse.data.userId;
    const signInresponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    token = signInresponse.data.token;
    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/avatar`,
      {
        imageLink: "link",
        name: "Jhonny",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    avatarId = avatarResponse.data.avatarId;
  });

  test("User can not update their avatar id with unavailable avatar id", async () => {
    const response = axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId: "293842",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response.statusCode).toBe(400);
  });

  test("User can update their metadata with an available avatar id", async () => {
    const response = axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response.statusCode).toBe(200);
  });

  test("User unable to update metadata if auth head is missing", async () => {
    const response = axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId,
    });
    expect(response.statusCode).toBe(403);
  });
});

describe("User Avatar Information", () => {
  let avatarId = "";
  let token = "";
  let userId = "";
  beforeAll(async () => {
    const username = "Aditya" + Math.random() * 100;
    const password = "password";
    const signUpResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    userId = signUpResponse.data.userId;
    const signInresponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    token = signInresponse.data.token;
    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/avatar`,
      {
        imageLink: "link",
        name: "Jhonny",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    avatarId = avatarResponse.data.avatarId;
  });

  test("Get back avatar information for a user", async () => {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/user/metadata/bulk?ids=${userId}`
    );
    expect(response.data.avatars.length).toBe(1);
    expect(response.data.avatars[0].userId).toBe(userId);
  });

  test("Get all available avatars", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);
    expect(response.data.avatars.length).not.toBe(0);
    const currentAvatar = response.data.avatars.find((x) => x.id == avatarId);
    expect(currentAvatar).tobeDefined();
  });
});

describe("Space information", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let adminToken = "";
  let adminId = "";
  let userId = "";
  let userToken = "";
  beforeAll(async () => {
    const username = "Aditya" + Math.random() * 100;
    const password = "password";
    const adminSignUpResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username,
        password,
        type: "admin",
      }
    );
    adminId = adminSignUpResponse.data.userId;
    const adminSignInresponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        username,
        password,
      }
    );
    adminToken = adminSignInresponse.data.token;

    const userSignUpResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username,
        password,
        type: "user",
      }
    );
    userId = userSignUpResponse.data.userId;
    const userSignInresponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        username,
        password,
      }
    );
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

    element1Id = element1.id;

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

    element2Id = element2.id;

    const map = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnailURL: "thumbnail_url",
        length: "100",
        breadth: "200",
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
  });

  test("User is able to create a space", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "MySpace",
        length: 100,
        breadth: 200,
        mapId,
      },
      {
        header: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.spaceId).toBeDefined();
  });

  test("User is able to create a space without mapid", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "MySpace",
        length: 100,
        breadth: 200,
      },
      {
        header: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.spaceId).toBeDefined();
  });

  test("User is not able to create a space without mapid and dimensions", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "MySpace",
      },
      {
        header: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.statusCode).toBe(400);
  });

  test("User is not able to delete a space that is not created", async () => {
    const response = await axios.delete(
      `${BACKEND_URL}/api/v1/space/randomIdThatDoesNotExist`,
      {
        name: "MySpace",
      },
      {
        header: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.statusCode).toBe(400);
  });

  test("User is not able to delete a space that is not created", async () => {
    const response = await axios.delete(
      `${BACKEND_URL}/api/v1/space/randomIdThatDoesNotExist`,
      {
        header: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.statusCode).toBe(400);
  });

  test("User is not able to delete a space of another user", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "MySpace",
        length: 100,
        breadth: 200,
      },
      {
        header: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const deleteResponse = await axios.delete(
      `${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,
      {
        header: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(response.statusCode).toBe(400);
  });

  test("Admin has no space initially", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
      headers: { authorization: `Bearer ${adminToken}` },
    });
    expect(response.data.spaces.length).toBe(0);
  });
});
