#!/usr/bin/env python3
"""One-time import of public Campus to Country media, verified against original Git blob hashes."""
import concurrent.futures, hashlib, json, pathlib, urllib.parse, urllib.request
ROOT = pathlib.Path.cwd().resolve()
MANIFEST = json.loads((ROOT / "deployment/import-media-20261016.json").read_text())
ORIGIN = "https://campus-to-country.emonhossain5081.chatgpt.site"
assert MANIFEST["sourceOrigin"] == ORIGIN
class SameOriginRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if urllib.parse.urlsplit(newurl).scheme != "https" or urllib.parse.urlsplit(newurl).netloc != urllib.parse.urlsplit(ORIGIN).netloc:
            raise ValueError("Unexpected asset redirect")
        return super().redirect_request(req, fp, code, msg, headers, newurl)
def git_hash(data):
    return hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()
def download(item):
    rel = pathlib.PurePosixPath(item["path"])
    if rel.is_absolute() or ".." in rel.parts or rel.parts[0] != "public":
        raise ValueError("Invalid media path")
    target = ROOT.joinpath(*rel.parts)
    if not target.resolve().is_relative_to(ROOT / "public"):
        raise ValueError("Media path escaped public directory")
    if target.is_file() and git_hash(target.read_bytes()) == item["sha"]:
        return item["path"]
    url = ORIGIN + "/" + urllib.parse.quote("/".join(rel.parts[1:]), safe="/")
    opener = urllib.request.build_opener(SameOriginRedirect)
    with opener.open(urllib.request.Request(url, headers={"User-Agent":"CampusToCountry-AssetImport/1.0"}), timeout=45) as response:
        data = response.read(item["size"] + 1)
    if len(data) != item["size"] or git_hash(data) != item["sha"]:
        raise ValueError("Asset integrity mismatch: " + item["path"])
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)
    return item["path"]
items = MANIFEST["files"]
for start in range(0, len(items), 20):
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        completed = list(pool.map(download, items[start:start+20]))
    print("Verified media files:", min(start+20,len(items)), "/", len(items), flush=True)
for item in items:
    data = (ROOT / item["path"]).read_bytes()
    assert len(data) == item["size"] and git_hash(data) == item["sha"], item["path"]
print("All original media hashes match. Ready to commit.")
