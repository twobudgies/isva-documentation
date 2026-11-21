#!/usr/bin/env bash
# Local browser render check (needs Google Chrome + internet for the Mermaid CDN).
# Usage: scripts/render-check.sh   -> serves the repo, dumps each page's DOM, checks sidebar/SVG/errors.
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
cd "$(dirname "$0")/.." || exit 1
PORT=8765; python3 -m http.server $PORT >/dev/null 2>&1 & SRV=$!; sleep 1
fail=0
for f in *.html; do
  dom=$("$CHROME" --headless=new --disable-gpu --virtual-time-budget=20000 --dump-dom "http://localhost:$PORT/$f" 2>/dev/null)
  want=$(grep -c 'class="mermaid"' "$f"); got=$(grep -o '<svg[^>]*id="mermaid-' <<<"$dom" | wc -l | tr -d ' ')
  side=$(grep -c 'id="sidebar"' <<<"$dom"); act=$(grep -c 'nav active' <<<"$dom"); pager=$(grep -c 'class="pager"' <<<"$dom")
  bad=$(grep -c -i -E 'Syntax error in|Diagram could not load' <<<"$dom")
  status=OK; { [ "$side" -ge 1 ] && [ "$act" -ge 1 ] && [ "$got" -ge "$want" ] && [ "$bad" -eq 0 ]; } || { status=FAIL; fail=1; }
  echo "$status $f diagrams=$got/$want sidebar=$side active=$act pager=$pager errors=$bad"
done
kill $SRV; exit $fail
