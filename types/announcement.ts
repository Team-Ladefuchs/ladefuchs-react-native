export type InfoContentSection =
	| { type: "headline"; text: string }
	| { type: "text"; text: string }
	| { type: "link"; text: string; url: string };

export interface AnnouncementResponse {
	content: InfoContentSection[];
	updated: string;
}
