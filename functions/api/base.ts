export const apiUrl = "https://api.ladefuchs.app";
export const authHeader = {
	headers: {
		Authorization: `Bearer ${process.env.API_TOKEN}`,
	},
} as const;
