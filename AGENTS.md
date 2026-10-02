<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Preserve the existing Fundamental. route structure and shared app shell; Practice mode hierarchy changes stay within `/practice` and its existing mode route so unrelated screens remain stable.
- Institution identity, accent tokens, and the theme on/off preference all live in `src/lib/institution.ts` (persistence + prefs) and the `[data-institution="..."]` blocks in `src/styles.css` (colors). The `data-institution` attribute is applied only when the theme toggle is on, but the selected institution and its logo must stay visible regardless — never gate identity on the theme flag. Official logos are lovable-assets pointers in `src/assets/*.asset.json` referenced via the optional `logo` field; never invent replacement logos.
