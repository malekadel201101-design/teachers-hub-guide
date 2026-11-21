'use strict';

(() => {
  const yearNodes = document.querySelectorAll('[data-year]');
  const currentYear = new Date().getFullYear();
  yearNodes.forEach((node) => { node.textContent = String(currentYear); });

  const form = document.querySelector('#needs-form');
  const result = document.querySelector('#needs-result');

  if (form && result) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const subject = form.querySelector('#subject')?.value || 'the selected subject';
      const format = form.querySelector('#format')?.value || 'any lesson format';
      const goal = form.querySelector('#goal')?.value || 'your learning goal';
      const isArabic = document.documentElement.lang.toLowerCase().startsWith('ar');
      const items = isArabic
        ? [
            `هل لدى المدرس خبرة مناسبة في ${subject} والمرحلة المطلوبة؟`,
            `هل طريقة الدرس تناسب تفضيلك: ${format}؟`,
            `كيف ستساعدك الحصص على تحقيق هدفك: ${goal}؟`,
            'ما مدة الحصة والتكلفة وما الذي يشمله السعر؟',
            'كيف تتم متابعة التقدم وما سياسة التأجيل أو الإلغاء؟'
          ]
        : [
            `Does the tutor have relevant experience in ${subject} and your level?`,
            `Does the lesson format fit your preference: ${format}?`,
            `How will the lessons support your goal: ${goal}?`,
            'How long is each lesson, what is the fee, and what does it include?',
            'How is progress followed up, and what is the rescheduling or cancellation policy?'
          ];
      const heading = isArabic ? 'قائمة المقارنة الخاصة بك' : 'Your comparison checklist';
      const intro = isArabic
        ? 'راجع النقاط دي مع ولي أمرك قبل الاتفاق مع أي مدرس:'
        : 'Review these points with a parent or guardian before agreeing to lessons:';
      const list = document.createElement('ul');
      list.className = 'result-list';
      items.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
      });
      result.replaceChildren();
      const title = document.createElement('h3');
      title.textContent = heading;
      const description = document.createElement('p');
      description.textContent = intro;
      result.append(title, description, list);
      const copyButton = document.createElement('button');
      copyButton.type = 'button';
      copyButton.className = 'button button-small button-secondary';
      copyButton.textContent = isArabic ? 'نسخ القائمة' : 'Copy checklist';
      copyButton.addEventListener('click', async () => {
        const text = `${heading}\n${intro}\n${items.map((item) => `• ${item}`).join('\n')}`;
        const copied = await copyText(text);
        copyButton.textContent = copied
          ? (isArabic ? 'تم النسخ ✓' : 'Copied ✓')
          : (isArabic ? 'تعذر النسخ' : 'Copy unavailable');
      });
      result.appendChild(copyButton);
    });
  }

  document.querySelectorAll('[data-copy-checklist]').forEach((button) => {
    button.addEventListener('click', async () => {
      const section = button.closest('section');
      const labels = section ? [...section.querySelectorAll('.checklist label')] : [];
      const lines = labels.map((label) => label.textContent.trim());
      const status = section?.querySelector('.copy-status');
      const copied = await copyText(lines.join('\n'));
      if (status) {
        const isArabic = document.documentElement.lang.toLowerCase().startsWith('ar');
        status.textContent = copied
          ? (isArabic ? 'تم نسخ القائمة.' : 'Checklist copied.')
          : (isArabic ? 'لم نتمكن من النسخ؛ يمكنك تحديد النص ونسخه يدويًا.' : 'Copy was unavailable. You can select and copy the list manually.');
      }
    });
  });

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (error) {
      // Continue to the selection-based fallback.
    }
    try {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      const copied = document.execCommand('copy');
      area.remove();
      return copied;
    } catch (error) {
      return false;
    }
  }
})();
