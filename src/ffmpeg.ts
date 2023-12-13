export async function run(
  args: string[],
): Promise<{ success: boolean; stdout: Uint8Array; stderr: Uint8Array }> {
  const command = new Deno.Command("ffmpeg", {
    args,
    stdout: "piped",
    stderr: "piped",
  });
  const { success, stdout, stderr } = await command.output();
  return { success, stdout, stderr };
}
