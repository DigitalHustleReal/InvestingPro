// Inngest client stub — placeholder until full integration is set up
// This prevents TS errors in files that import from this module

export const inngest = {
  createFunction: (...args: any[]) => args[args.length - 1],
  send: async (_event: { name: string; data?: Record<string, any> }) => {},
};

export default inngest;
