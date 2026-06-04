#!/usr/bin/env python3
"""GitHub活動収集スクリプト - activity-report スキル用

Usage:
    python3 collect_activity.py <username> <since_utc> [until_utc]

Example:
    # 今日 (JST 00:00 = 前日 15:00 UTC)
    python3 collect_activity.py <your-github-username> 2026-03-25T15:00:00Z

    # 今週月曜〜今日
    python3 collect_activity.py <your-github-username> 2026-03-22T15:00:00Z 2026-03-26T15:00:00Z

Output: JSON with repos, commits, issues, prs
"""

import json
import subprocess
import sys
from datetime import datetime


def gh_api(endpoint):
    result = subprocess.run(
        ["gh", "api", endpoint, "--paginate"],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        return []
    try:
        data = json.loads(result.stdout)
        return data if isinstance(data, list) else [data]
    except json.JSONDecodeError:
        # --paginate can return multiple JSON arrays
        items = []
        for line in result.stdout.strip().split('\n'):
            try:
                parsed = json.loads(line)
                if isinstance(parsed, list):
                    items.extend(parsed)
                else:
                    items.append(parsed)
            except json.JSONDecodeError:
                continue
        return items


def collect(username, since_utc, until_utc=None):
    # Step 1: Get events to find active repos and issue/PR activity
    events = gh_api(f"/users/{username}/events?per_page=100")

    active_repos = set()
    issue_events = []
    pr_events = []

    for e in events:
        created = e.get("created_at", "")
        if created < since_utc:
            continue
        if until_utc and created > until_utc:
            continue

        repo = e.get("repo", {}).get("name", "").split("/")[-1]
        active_repos.add(repo)

        etype = e.get("type", "")
        if etype == "IssuesEvent":
            issue = e["payload"]["issue"]
            issue_events.append({
                "repo": repo,
                "action": e["payload"]["action"],
                "number": issue["number"],
                "title": issue["title"]
            })
        elif etype == "PullRequestEvent":
            pr = e["payload"].get("pull_request", {})
            pr_events.append({
                "repo": repo,
                "action": e["payload"].get("action", "unknown"),
                "number": pr.get("number", 0),
                "title": pr.get("title", "(no title)")
            })

    # Step 2: Get commits per repo
    repos_data = []
    for repo in sorted(active_repos):
        params = f"since={since_utc}"
        if until_utc:
            params += f"&until={until_utc}"

        commits_raw = gh_api(f"repos/{username}/{repo}/commits?{params}&per_page=100")

        commits = []
        for c in commits_raw:
            msg = c.get("commit", {}).get("message", "")
            first_line = msg.split("\n")[0]
            # Filter out Co-Authored-By only commits and merge commits
            if first_line.startswith("Co-Authored-By"):
                continue
            if first_line.startswith("Merge"):
                continue
            commits.append(first_line)

        if commits:
            repos_data.append({
                "repo": repo,
                "commit_count": len(commits),
                "commits": commits
            })

    # Sort by commit count descending
    repos_data.sort(key=lambda x: x["commit_count"], reverse=True)

    output = {
        "period": {"since": since_utc, "until": until_utc or "now"},
        "repos": repos_data,
        "issues": issue_events,
        "pull_requests": pr_events,
        "total_commits": sum(r["commit_count"] for r in repos_data)
    }

    return output


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: collect_activity.py <username> <since_utc> [until_utc]", file=sys.stderr)
        sys.exit(1)

    username = sys.argv[1]
    since = sys.argv[2]
    until = sys.argv[3] if len(sys.argv) > 3 else None

    result = collect(username, since, until)
    print(json.dumps(result, ensure_ascii=False, indent=2))
