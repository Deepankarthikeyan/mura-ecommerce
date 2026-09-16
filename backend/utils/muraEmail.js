const MURA = {
  name: 'MuRa@23',
  tagline: "India's finest sale sarees",
  email: 'murapodanur@gmail.com',
  phone: '02 123 333 444',
  address: 'Podanur, Coimbatore, Tamil Nadu 641023, India',
  primary: '#cf0653',
  cream: '#FFFDE9',
  beige: '#f3ece8',
  text: '#2B2A29',
  muted: '#4a4a4a',
  white: '#ffffff',
};

function wrapMuraEmail({ title, bodyHtml }) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><title>${title}</title></head>
<body style="margin:0;padding:0;background:${MURA.beige};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${MURA.beige};padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${MURA.white};border-radius:12px;overflow:hidden;">
          <tr><td style="height:6px;background:${MURA.primary};font-size:0;line-height:0;">&nbsp;</td></tr>
          <tr>
            <td style="background:${MURA.cream};padding:28px 32px;text-align:center;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:32px;color:${MURA.text};">MuRa<span style="color:${MURA.primary};">@23</span></p>
              <p style="margin:8px 0 0 0;font-family:'Segoe UI',Arial,sans-serif;font-size:11px;letter-spacing:2.4px;text-transform:uppercase;color:${MURA.primary};">${MURA.tagline}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;font-family:'Segoe UI',Arial,sans-serif;color:${MURA.text};">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="background:${MURA.text};padding:24px 32px;text-align:center;">
              <p style="margin:0 0 8px 0;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:${MURA.white};">${MURA.name}</p>
              <p style="margin:0;font-family:'Segoe UI',Arial,sans-serif;font-size:12px;line-height:1.7;color:#d4cfc8;">
                ${MURA.address}<br />
                ${MURA.phone} · ${MURA.email}
              </p>
              <p style="margin:14px 0 0 0;padding-top:14px;border-top:1px solid #444;font-size:12px;color:#979797;">
                Handcrafted with love in India.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = { MURA, wrapMuraEmail };
