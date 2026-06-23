const searchService = require("./searchService");
const asyncHandler = require("../../middlewares/asyncHandler"); 

exports.renderSearchPage = asyncHandler(async (req, res) => {
    const query = req.query.q || "";
    let searchResults = { videos: [], users: [] };

    if (query) {
        searchResults = await searchService.globalSearch(query);
    }
    
    res.render("search", { title: `Busca por: ${query}`, query, searchResults });
});