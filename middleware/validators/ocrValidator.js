const isOcrJsonValid = (pages) => {
    if (!pages || !Array.isArray(pages) || pages.length == 0) {
        throw new Error('OCR Json must have at least one page');
    }
    pages.forEach(page => {
        if (!page.blocks || !Array.isArray(page.blocks)) {
            throw new Error('Each OCR page must have the blocks field');
        }
    });
    return true;
}

exports.isOcrJsonValid = isOcrJsonValid;