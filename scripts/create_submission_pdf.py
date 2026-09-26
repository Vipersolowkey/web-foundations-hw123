from pathlib import Path
from PIL import Image
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas
from textwrap import wrap

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output' / 'pdf'
SHOT = ROOT / 'output' / 'screenshots' / 'product-full.png'
REPO = 'https://github.com/Vipersolowkey/web-foundations-hw123'
AI_LINK = 'Add your ChatGPT/Codex shared-conversation URL before submitting.'
W, H = A4
M = 46
INK = HexColor('#12211f')
PAPER = HexColor('#f6f3ed')
CORAL = HexColor('#ff765b')
LIME = HexColor('#d8ff57')

def text(c, value, x, y, size=10, font='Helvetica', color=INK):
    c.setFont(font, size); c.setFillColor(color); c.drawString(x, y, value)

def footer(c, page, total=6):
    c.setStrokeColor(HexColor('#c9c5bd')); c.line(M, 32, W-M, 32)
    text(c, 'Web Application Development - HW1, HW2, HW3', M, 19, 7, color=HexColor('#5a625e'))
    text(c, f'{page} / {total}', W-M-22, 19, 7, color=HexColor('#5a625e'))

def link(c, label, url, x, y, size=10, color=INK):
    text(c, label, x, y, size, 'Helvetica-Bold', color)
    width = stringWidth(label, 'Helvetica-Bold', size)
    c.setStrokeColor(color); c.line(x, y-2, x+width, y-2)
    c.linkURL(url, (x, y-4, x+width, y+size+2), relative=0)

def screenshot_page(c, image, top, bottom, title, caption, page):
    c.setFillColor(PAPER); c.rect(0, 0, W, H, fill=1, stroke=0)
    text(c, title, M, H-48, 21, 'Helvetica-Bold')
    text(c, caption, M, H-66, 9, color=HexColor('#5a625e'))
    with Image.open(image) as source:
        crop = source.crop((0, top, source.width, bottom))
        crop_path = OUT / f'_panel_{page}.png'
        crop.save(crop_path)
    available_w, available_h = W - (M*2), H - 150
    ratio = min(available_w / crop.width, available_h / crop.height)
    draw_w, draw_h = crop.width * ratio, crop.height * ratio
    x, y = (W-draw_w)/2, 60
    c.setStrokeColor(HexColor('#c9c5bd')); c.rect(x-2, y-2, draw_w+4, draw_h+4, fill=0)
    c.drawImage(ImageReader(crop_path), x, y, draw_w, draw_h)
    link(c, 'Repository: github.com/Vipersolowkey/web-foundations-hw123', REPO, M, 43, 7, HexColor('#23536b'))
    footer(c, page)

def prompt_page(c, prompts, page):
    c.setFillColor(PAPER); c.rect(0, 0, W, H, fill=1, stroke=0)
    text(c, 'AI assistance prompt log', M, H-48, 21, 'Helvetica-Bold')
    text(c, 'Reconstructed prompts for submission documentation - not a verbatim chat export.', M, H-66, 8.5, color=HexColor('#5a625e'))
    y = H - 104
    for number, title, prompt in prompts:
        text(c, f'{number:02d}', M, y, 9, 'Helvetica-Bold', CORAL)
        text(c, title, M+30, y, 12, 'Helvetica-Bold')
        y -= 19
        for line in wrap(prompt, 92):
            text(c, line, M+30, y, 8.2, color=HexColor('#273632'))
            y -= 13
        y -= 18
    link(c, 'Repository: github.com/Vipersolowkey/web-foundations-hw123', REPO, M, 43, 7, HexColor('#23536b'))
    footer(c, page)

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    target = OUT / 'web-foundations-hw123-submission.pdf'
    c = canvas.Canvas(str(target), pagesize=A4, pageCompression=1)
    c.setTitle('HW1 HW2 HW3 Submission - Signal and Sound')
    c.setAuthor('Student submission')
    c.setFillColor(PAPER); c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(INK); c.circle(M+22, H-70, 22, fill=1, stroke=0)
    text(c, 'S/S', M+13, H-74, 9, 'Helvetica-Bold', LIME)
    text(c, 'WEB APPLICATION DEVELOPMENT', M, H-128, 9, 'Helvetica-Bold', HexColor('#23536b'))
    text(c, 'Production Portfolio,', M, H-178, 29, 'Helvetica-Bold')
    text(c, 'Web Audio & Resilient Events', M, H-216, 29, 'Helvetica-Oblique', CORAL)
    text(c, 'Submission evidence for Homework 1, Homework 2, and Homework 3.', M, H-255, 11, color=HexColor('#5a625e'))
    c.setFillColor(LIME); c.roundRect(M, H-345, W-(M*2), 62, 10, fill=1, stroke=0)
    text(c, 'REPOSITORY - all three assignments', M+18, H-310, 8, 'Helvetica-Bold')
    link(c, 'github.com/Vipersolowkey/web-foundations-hw123', REPO, M+18, H-332, 12, INK)
    text(c, 'Included deliverables', M, H-397, 10, 'Helvetica-Bold')
    items = [
        'HW1 - semantic production portfolio, accessible dialog, keyboard focus and CSP.',
        'HW2 - data-sound contract, polyphonic Web Audio, repeat gate, FIFO beat recorder.',
        'HW3 - UTC countdown, RSVP state machine, input checks, double-submit prevention.',
        'AI_FAILURE_AUDIT.md - three detected AI defects, diagnosis, fixes, and verification.'
    ]
    y = H-421
    for item in items:
        text(c, u'•', M, y, 11, color=CORAL); text(c, item, M+14, y, 9); y -= 25
    text(c, 'AI conversation link', M, 184, 10, 'Helvetica-Bold')
    text(c, AI_LINK, M, 164, 8.5, color=CORAL)
    text(c, 'Reason: a share URL is created only by the chat-account owner; it cannot be generated from this workspace.', M, 148, 8, color=HexColor('#5a625e'))
    text(c, 'Prompt log and failure audit are attached on pages 2-3; add your Share URL before upload.', M, 127, 8, 'Helvetica-Bold')
    footer(c, 1); c.showPage()
    prompts = [
        (1, 'HW1 - portfolio foundation', 'Build a one-page production portfolio with semantic HTML, external CSS, modular JavaScript, native controls, a skip link, visible keyboard focus, three project cards, and an accessible case-study modal. Do not use inline handlers or runtime dependencies, and keep it responsive from 375px upward.'),
        (2, 'HW1 - accessibility and security review', 'Review the portfolio for WCAG 2.2 AA. Make the dialog announce its title and description, move focus into it, trap Tab and Shift+Tab, restore focus to its opener, and recommend a strict CSP that works without inline JavaScript. Identify reduced-motion and responsiveness checks.'),
        (3, 'HW2 - contract-first drum kit', 'Design the data contract before JavaScript: each native drum button needs data-sound and a unique lowercase data-key. Create a polyphonic Web Audio engine, support pointer and keyboard input, prevent held-key repeats, and describe a small testable recorder API that stores timestamped beats in FIFO order.')
    ]
    prompt_page(c, prompts, 2); c.showPage()
    prompts = [
        (4, 'HW3 - resilient event form', 'Implement a countdown from an explicit ISO 8601 UTC timestamp, not a browser-local date string. Model the RSVP flow as idle, submitting, success, and error; validate input, prevent double submits, and write status messages through textContent rather than innerHTML. Keep tests deterministic.'),
        (5, 'AI failure-mode audit', 'Critically review generated code and document three plausible AI defects: time-zone parsing, unsafe DOM rendering, and keyboard auto-repeat. For each defect, provide a diagnosis method, a refactored solution, and a concrete verification step. Keep the report suitable for a live defense and do not invent external integrations.')
    ]
    prompt_page(c, prompts, 3); c.showPage()
    with Image.open(SHOT) as shot: h = shot.height
    screenshot_page(c, SHOT, 0, h//3, 'Product evidence - HW1', 'Semantic project portfolio and accessible case-study controls.', 4); c.showPage()
    screenshot_page(c, SHOT, h//3, 2*h//3, 'Product evidence - HW2', 'Contract-first Drum Kit with keyboard bindings and recorder panel.', 5); c.showPage()
    screenshot_page(c, SHOT, 2*h//3, h, 'Product evidence - HW3', 'UTC countdown and guarded RSVP state-machine form.', 6); c.showPage()
    c.save()
    for path in OUT.glob('_panel_*.png'): path.unlink()
    print(target)

if __name__ == '__main__': main()
