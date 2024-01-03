const commonCommands = () => {

  // Borrowed from https://medium.com/appear-here-product-engineering/testing-iframes-with-cypress-including-stripe-and-hellosign-fed90d639870

  /**
   * Will check if an iframe is ready for DOM manipulation. Just listening for the
   * load event will only work if the iframe is not already loaded. If so, it is
   * necessary to observe the readyState. The issue here is that Chrome initialises
   * iframes with "about:blank" and sets their readyState to complete. So it is
   * also necessary to check if it's the readyState of the correct target document.
   *
   * Some hints taken and adapted from:
   * https://stackoverflow.com/questions/17158932/how-to-detect-when-an-iframe-has-already-been-loaded/36155560
   *
   * @param $iframe - The iframe element
   */
  const isIframeLoaded = $iframe => {
    const contentWindow = $iframe.contentWindow;

    const src = $iframe.attributes.src;
    const href = contentWindow.location.href;
    if (contentWindow.document.readyState === 'complete') {
      return href !== 'about:blank' || src === 'about:blank' || src === '';
    }

    return false;
  };

  /**
   * Wait for iframe to load, and call callback
   *
   * Some hints taken and adapted from:
   * https://gitlab.com/kgroat/cypress-iframe/-/blob/master/src/index.ts
   */
  Cypress.Commands.add('iframe', {prevSubject: 'element'}, $iframes => new Cypress.Promise(resolve => {
    const loaded = [];

    $iframes.each((_, $iframe) => {
      loaded.push(
        new Promise(subResolve => {
          if (isIframeLoaded($iframe)) {
            subResolve($iframe.contentDocument.body);
          } else {
            Cypress.$($iframe).on('load.appearHere', () => {
              if (isIframeLoaded($iframe)) {
                subResolve($iframe.contentDocument.body);
                Cypress.$($iframe).off('load.appearHere');
              }
            });
          }
        })
      );
    });

    return Promise.all(loaded).then(resolve);
  }));
}


module.exports = {
  commonCommands
}
