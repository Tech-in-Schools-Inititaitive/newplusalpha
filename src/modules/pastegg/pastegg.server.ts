import { PasteGG } from './pastegg.types';

/**
 * Post a paste to paste.gg
 * [called by the API]
 *  - API description: https://github.com/ascclemens/paste/blob/master/api.md
 *
 * @param title Title of the paste
 * @param fileName File with extension, e.g. 'conversation.md'
 * @param fileContent Textual content (e.g. markdown text)
 * @param origin the URL of the page that generated the paste
 * @param expireDays Number of days after which the paste will expire (0 = never expires, default = 30)
 */
export async function pasteGgPost(title: string, fileName: string, fileContent: string, origin: string, expireDays: number = 30): Promise<PasteGG.Wire.PasteResponse> {

  // Default: expire in 30 days
  let expires = null;
  if (expireDays && expireDays >= 1) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expireDays);
    expires = expirationDate.toISOString();
  }

  const pasteData: PasteGG.Wire.PasteRequest = {
    name: title,
    description: origin,
    visibility: 'unlisted',
    ...(expires && { expires }),
    files: [{
      name: fileName,
      content: {
        format: 'text',
        value: fileContent,
      },
    }],
  };

  const response = await fetch('https://api.paste.gg/v1/pastes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pasteData),
  });

  if (response.ok)
    return await response.json();

  console.error(`Failed to create paste: ${response.status}`, response);
  throw new Error(`Failed to create paste: ${response.statusText}`);

}