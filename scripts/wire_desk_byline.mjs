import { readFileSync, writeFileSync } from "fs";

const filePath =
  "C:/Users/shivp/Desktop/InvestingPro_App/app/articles/[slug]/page.tsx";

let content = readFileSync(filePath, "utf-8");

// 1. Add the import after the AuthorBadge import
const OLD_IMPORT = `import { AuthorBadge } from "@/components/articles/AuthorBadge";`;
const NEW_IMPORT = `import { AuthorBadge } from "@/components/articles/AuthorBadge";
import { DeskByline } from "@/components/articles/DeskByline";`;

if (!content.includes(OLD_IMPORT)) {
  console.error("ERROR: AuthorBadge import not found");
  process.exit(1);
}
content = content.replace(OLD_IMPORT, NEW_IMPORT);

// 2. Resolve the author name for the conditional check
// Insert a variable that captures the resolved author name right before the meta row
const OLD_META_ROW = `              {/* Meta row — author + actions on one line, date/time below */}
              <div className="mb-8 pb-8 border-b border-border space-y-4">`;

const NEW_META_ROW = `              {/* Meta row — author + actions on one line, date/time below */}
              <div className="mb-8 pb-8 border-b border-border space-y-4">`;

// 3. Insert DeskByline right after the closing </div> of the AuthorBadge+actions row
// The existing "Fact-checked · Editorial standards" link in the secondary row will be
// replaced by DeskByline so we don't duplicate it.
const OLD_SECONDARY_ROW = `                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted-foreground">
                  {/* Single date — show "Updated" if different from published, otherwise show published */}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {article.updated_at &&
                    article.published_at &&
                    article.updated_at.slice(0, 10) !==
                      article.published_at.slice(0, 10)
                      ? \`Updated \${new Date(article.updated_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}\`
                      : \`Published \${new Date(article.published_at || article.published_date || article.updated_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}\`}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {article.read_time || "5"} min read
                  </span>
                  <span className="text-muted-foreground/60">·</span>
                  <Link
                    href="/about/editorial-team"
                    className="text-primary hover:underline"
                  >
                    Fact-checked · Editorial standards
                  </Link>
                </div>`;

const NEW_SECONDARY_ROW = `                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted-foreground">
                  {/* Single date — show "Updated" if different from published, otherwise show published */}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {article.updated_at &&
                    article.published_at &&
                    article.updated_at.slice(0, 10) !==
                      article.published_at.slice(0, 10)
                      ? \`Updated \${new Date(article.updated_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}\`
                      : \`Published \${new Date(article.published_at || article.published_date || article.updated_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}\`}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {article.read_time || "5"} min read
                  </span>
                </div>

                {/* Desk byline — auto-selects the right specialist desk from the article category.
                    Shown for all articles; complements AuthorBadge above. */}
                <DeskByline
                  category={article.category}
                  updatedAt={article.updated_at || article.published_at}
                />`;

if (!content.includes(OLD_SECONDARY_ROW)) {
  console.error("ERROR: secondary meta row not found. Searching for partial...");
  const idx = content.indexOf("Fact-checked · Editorial standards");
  console.error("Fact-checked found at index:", idx);
  console.error("Context:", JSON.stringify(content.slice(idx - 200, idx + 200)));
  process.exit(1);
}

content = content.replace(OLD_SECONDARY_ROW, NEW_SECONDARY_ROW);

writeFileSync(filePath, content, "utf-8");
console.log("SUCCESS — wrote", content.length, "chars");
