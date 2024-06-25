import { Client } from "discord-rpc";
const onCleanupErr = (err: Error) => console.warn("Encountered error while cleaning up DiscordRPC", err);
export class DiscordRPC {
	public rpcClient?: Client;
	constructor(private readonly clientId: string) {}

	public isConnected() {
		// @ts-expect-error Types dont include internals like transport
		return !!this.rpcClient?.transport?.socket;
	}
	async ensureRPC(): Promise<Client> {
		if (this.rpcClient && this.isConnected()) return this.rpcClient;
		this.rpcClient = await new Client({ transport: "ipc" }).login({ clientId: this.clientId });
		if (!this.isConnected()) return this.ensureRPC();
		return this.rpcClient;
	}
	async cleanp(clearActivity?: false) {
		if (this.isConnected() && clearActivity) await this.rpcClient!.clearActivity().catch(onCleanupErr);
		await this.rpcClient?.destroy().catch(onCleanupErr);
	}
}
