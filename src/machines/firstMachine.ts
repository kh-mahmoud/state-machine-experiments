import { type User, type Context } from "./../../types";
import { assign, fromPromise, setup } from "xstate";

export const firstMachine = setup({
  types: {
    events: {} as
      | { type: "new_User" }
      | { type: "SUBMIT_USER"; user: User }
      | { type: "DELETE"; id: number }
      | { type: "CANCEL_ADD" },

    context: {} as Context,
  },

  actors: {
    fetchPosts: fromPromise(async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      return res.json();
    }),

    fakeSaveUser: fromPromise(async ({ input }: { input: User }) => {
      await new Promise((res) => setTimeout(res, 2000));
      return input;
    }),

    fakeDeleteUser: fromPromise(
      async ({ input }: { input: { id: number } }) => {
        await new Promise((res) => setTimeout(res, 2000));
        return input;
      },
    ),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDMCWAnWAXAsgQwGMALVAOzADoAbAezwjKgGIIbyKyA3Gga0rUy5CJdrXqMEXGgTxZUbANoAGALrKViUAAcasVHLaaQAD0QAmAMwBOChbMAOAIwWALPasA2AOxmArGYAaEABPRGcbPyUlR0cXLy84iw8PAF8UoIFsfGIySjEGUmYwdHQadAotKllkMoBbCkyhHNE6AqhJUm4ZA1J1dSMdPR6jUwRLGzsnV3dvP0CQxCtHCgSrNZ8rL2sXR1T0kEbskTzWyCZyAHcAfQBVWGL+pBBB-XlSEcR-INCxuIpIqK+Fy+RyWJRmNIZDBZYS5Cj0CAAMTqFGweHQWAAghA2kwAMo3ABCOAAkgAVW54gCiACVHtpdK9DE9RmYXGYKL4rBYEmZPECfH5vohvC5-tEzKD7EpfF4lD5IQdoU1jvCccj0PU0RjsbiAMKYgByeqpABkrpiACKW+nPRnDFmIdw2WL2DwWJR2eUy+zChD2Cy+CiOEFspQ7eUWGKKw6w9gIjVavCcRgsNiUKR8BrKo5whMo2DJiRSbpvPqqAb2t4fBCbJQUDzORzxFzJd3gv2N5b2aWuwMeNxsmM5uOUfOa1FFwpMYqlcqVaoo2PNMfqgtT9ol2Rl1S2l4O0CsnkrHsucPSryi4F+3xRzlWPlKKwuCzWJZ7fakGgQOBGZfHSshmrR0EAAWisP1QKDNY1nsMwPF8WVEJcKxfGHQRcxacRCkApl3hA9k-ScTkoiiVwlA8U8ZXQmEV2oU4IFwg8TCdLlOQcMxPTcF9bxcP07DFSionidYEK2GiVThfJZzKJjgMPRAdgsf5PDdM9fCiblfQWWt6y8DSyJQ6IPTcCTMNXJE6jk5kFIQaw-RcRyKCfPlLB5Zx-GcMzRzVSyJ21LEcUYaz8Ns+wvE7N1OX8fSHzcRtHO8ujxyTFMcKefd5JYhA4g5BDXEcT0ElBNYb1vCg4imPlXTPKw0jSIA */
  id: "firstMachine",

  context: {
    users: [],
    draftUser: null,
    draftDeleteId: null,
    retryCount: 0,
  },

  initial: "loading",

  states: {
    loading: {
      invoke: {
        src: "fetchPosts",
        onDone: {
          target: "loaded",
          actions: assign({
            users: ({ event }) => event.output,
          }),
        },

        onError: {
          target: "loaderror",
        },
      },
    },

    loaded: {
      on: {
        new_User: {
          target: "addForm",
        },
        DELETE: {
          target: "deleting",
          actions: assign({
            draftDeleteId: ({ event }) => event.id,
          }),
        },
      },
    },

    deleting: {
      entry: assign({
        users: ({ context }) =>
          context.users.filter((u) => u.id !== context.draftDeleteId),
      }),

      invoke: {
        src: "fakeDeleteUser",
        input: ({ context }) => {
          if (context.draftDeleteId == null) {
            throw new Error("No delete id set");
          }

          return {
            id: context.draftDeleteId,
          };
        },
        onDone: {
          target: "loaded",
        },

        onError: {
          target: "loaded",
        },
      },
    },

    loaderror: {},

    addForm: {
      initial: "startAdding",

      states: {
        startAdding: {
          on: {
            SUBMIT_USER: {
              target: "saving",
              actions: assign({
                draftUser: ({ event }) => event.user,
              }),
            },

            CANCEL_ADD: {
              target: "#firstMachine.loaded",
              actions: assign({
                draftUser: null,
              }),
            },
          },
        },

        saving: {
          entry: assign({
            users: ({ context }) => {
              if (!context.draftUser) return context.users;

              return [...context.users, context.draftUser];
            },
          }),

          invoke: {
            src: "fakeSaveUser",
            input: ({ context }) => context.draftUser!,

            onDone: {
              target: "#firstMachine.loaded",
              actions: assign({
                draftUser: null,
              }),
            },

            onError: {
              target: "startAdding",
              actions: assign({
                users: ({ context }) =>
                  context.users.filter((u) => u.id !== context.draftUser?.id),
                  draftUser: null,
              }),
            },
          },
        },
      },
    },
  },
});
