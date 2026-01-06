document.addEventListener('DOMContentLoaded', ()=>{
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('h3');
    if(!header) return;
    header.addEventListener('click', () => {
      item.classList.toggle('active');
      const content = item.querySelector('.faq-content');
      if (!content) return;
      if (item.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = 0;
      }
    });
  });
});
