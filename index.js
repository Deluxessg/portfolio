const { loadData, render } = require("./lib");

(async () => {
    try {
        const data = await loadData();

        const projects = data
            .filter((x) => x.slug.startsWith("projects/"))
            .sort((a, b) => a.order - b.order);
        const featuredProjects = projects.filter((x) => x.featured).reverse();

        const output = await render(data, { projects, featuredProjects });

        console.log(`Rendered ${output.length} pages.`);
    } catch (error) {
        console.log("Error generating website", error);
    }
})();
