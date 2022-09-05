const path = require("path");
const { readFile, outputFile } = require("fs-extra");
const express = require("express");
const { engine } = require("express-handlebars");
const globby = require("globby");
const matter = require("gray-matter");
const marked = require("marked");

const DATA_PATH = path.join(__dirname, "data");
const VIEWS_PATH = path.join(__dirname, "src", "views");
const BUILD_PATH = path.join(__dirname, "dist");

const config = require(path.join(__dirname, "config.json"));

const app = express();
app.engine(
    ".handlebars",
    engine({
        helpers: {
            getLink,
            getNavClass,
        },
    })
);
app.set("view engine", "handlebars");
app.set("layoutsDir", path.join(VIEWS_PATH, "layouts"));
app.set("views", VIEWS_PATH);

app.locals.config = config;

function getLink(page) {
    const base =
        page.link || `${page.slug.startsWith("/") ? "" : "/"}${page.slug}`;
    return base;
}

function getNavClass({ slug }, currentPage) {
    const cleanSlug = slug && slug[0] === "/" ? slug.slice(1) : slug;
    return currentPage.slug.startsWith(cleanSlug)
        ? `${cleanSlug} current`
        : cleanSlug;
}

async function loadData(cwd = DATA_PATH) {
    const files = await globby("**/*.md", { cwd });
    return Promise.all(
        files.map(async (fileName) => {
            const fullPath = path.join(cwd, fileName);
            const contents = await readFile(fullPath, "utf-8");
            const parsed = matter(contents);
            const outputFileName = fileName.replace(".md", "");
            return {
                template: "page",
                ...parsed.data,
                slug: parsed.data.slug || outputFileName,
                content: parsed.content,
            };
        })
    );
}

async function renderPage(page) {
    const { title, template, content, slug } = page;
    return new Promise((resolve, reject) => {
        app.render(
            template,
            {
                ...page,
                content: content ? marked.parse(content) : null,
            },
            async (error, html) => {
                if (error) {
                    reject(error);
                    return;
                }
                const outputFileName = `${slug}.html`;
                await outputFile(path.join(BUILD_PATH, outputFileName), html);
                resolve({
                    title,
                    outputFileName,
                });
            }
        );
    });
}

async function render(data, locals) {
    app.locals = { ...app.locals, ...locals };
    return await Promise.all(data.map(renderPage));
}

module.exports = { loadData, render };
