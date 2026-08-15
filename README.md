---
layout: minimal
title: Pinokio 8.1.0
description: Pinokio 8.1 Disk Saver release notes and testing guide
permalink: /
has_toc: false
render_with_liquid: false
section_nav_depth: 2
---

# Pinokio 8.1 — Disk Saver

AI apps often download the same huge models, runtimes, and packages into different folders. **Disk Saver** finds files that are exactly the same and lets them share disk space—without moving them or changing the paths your apps use.

It scans Pinokio Home first. You can also add model libraries, caches, old Pinokio Homes, project folders, and other locations on your computer.

> **Nothing changes during a scan.** Pinokio only deduplicates files after you review the results and choose a Deduplicate action.

> **Apps keep their own files and lifecycle.** A model can stay inside an app's folder and disappear when you delete that app. If another app has the same model, both paths can share one physical copy in the meantime.

![Disk Saver overview showing saved space, potential savings, locations, and file status](media/p81-01-global-overview.jpg)

[Download Pinokio](https://desktop.pinokio.co/)

# Features to test

These screenshots are from Pinokio 8.1. Your file names, counts, and storage totals will be different.

## 1. Run the first global scan

Open **Manage → Disk Saver**, choose a minimum file size, and start the scan. A larger minimum is faster; a smaller one may find more savings.

You can scan **All files, 1 MB+, 10 MB+, 50 MB+, 100 MB+, 500 MB+, or 1 GB+**. Empty files are ignored.

![Completed global Disk Saver scan](media/p81-01-global-overview.jpg)

**Try it**

- Start a scan and watch its progress.
- Cancel it, then start again.
- Change the minimum size and run another scan.
- If a path cannot be read, check that the scan still finishes and shows an exclusions notice.
- Confirm that scanning alone does not link, replace, or delete anything.

## 2. Understand the result views

Each view answers a different question:

- **All files** — every non-empty file that met the size limit.
- **Duplicates** — identical files you can deduplicate.
- **Cannot deduplicate** — identical files that cannot safely share storage.
- **Deduplicated** — files already sharing storage.
- **No action needed** — files with no duplicate action to take.
- **Unused files** — private Disk Saver links left after their app files were deleted.
- **Activity** — a record of Disk Saver changes.

Use Search, status and location filters, and the **Folders / Files** switch to narrow the list.

![Duplicates grouped by Pinokio apps and external folders](media/p81-02-duplicates.jpg)

**Try it**

- Open every view and compare its count with the files shown.
- Search for part of a file or folder name.
- Switch between Folders and Files.
- Choose one location and confirm that its actions stay inside that location.

## 3. Read the storage summary

The summary separates what you use now from what you could save:

- **Still used** — physical space currently occupied.
- **Saved** — space already avoided through deduplication.
- **Can save** — space available from eligible duplicates.

The numbers update after each action. It is normal for the logical file total to be larger than the physical storage used: several paths can point to the same data.

![Storage bar showing still used, saved, and available savings](media/p81-01-global-overview.jpg)

**Try it**

- Note all three values.
- Deduplicate one test file. **Saved** should rise while **Can save** falls.
- Make it separate again. The values should move back.

## 4. Deduplicate one file—or many

The Duplicates view groups byte-identical files and shows where each match lives. You can act on one file, select up to 500 rows, deduplicate a folder or location, or choose **Deduplicate all**.

Every path stays in place. Pinokio replaces only the redundant storage with a hardlink to the same verified content.

![A selected duplicate and the Deduplicate selected file action](media/p81-03-deduplicate-selection.jpg)

**Try it**

- Select one disposable duplicate first.
- Check that the button shows the selection count and expected savings.
- After deduplicating, confirm that both paths still exist and their checksums match the originals.
- Check that the file moves to **Deduplicated** and appears in Activity.
- Run a location-level action and confirm that it does not touch other locations.

If a file changes after the scan—or belongs to a running Pinokio app—Pinokio may skip it. Close the app and scan again.

## 5. See why a file cannot be deduplicated

Matching contents are not enough. Files must also have compatible permissions, ownership, filesystems, and locations. Disk Saver puts unsafe matches under **Cannot deduplicate** and tells you why.

![Cannot deduplicate view explaining permission and ownership differences](media/p81-04-cannot-deduplicate.jpg)

**Try it**

- Confirm that this view has no bulk Deduplicate action.
- Check that every row gives a reason.
- If you see **Try again**, fix the temporary access problem and retry.
- Confirm that one unreadable path does not discard the rest of the scan.

## 6. Make a file separate again

**Make separate** reverses deduplication. Pinokio gives the selected path its own physical copy without changing its name or location.

Use it before editing a file in place, making an independent archive, or simply testing the undo path. You may need free space equal to the full file size.

![Deduplicated files with Make separate actions](media/p81-05-make-separate.jpg)

**Try it**

- Make one disposable deduplicated file separate.
- Confirm that its path and checksum stay the same.
- Confirm that it no longer shares an inode with the other copy.
- Try a checkbox selection and review the larger-batch confirmation.
- Check that Activity records the separation.

## 7. Clean up unused private links

Disk Saver keeps a private, verified link to managed content. If all matching app paths are later deleted, that link becomes unused and appears under **Unused files**.

Cleanup is conservative: Pinokio only removes an unchanged private link when its link count proves that nothing still depends on it. An empty view with **No cleanup needed** is normal.

![Unused files empty state](media/p81-06-unused-files.jpg)

**Try it**

- If unused links exist, review their count and reclaimable size.
- Clean up one, then try **Clean up all**.
- Confirm that an in-use private link cannot be cleaned up.
- Check that Activity records the cleanup.

## 8. Add folders outside Pinokio Home

Choose **Add → Add folder** to include a model library, download cache, project archive, old Pinokio Home, or any folder you control. It appears under **Other folders**, where you can filter, scan, or remove it independently.

Removing a location from Disk Saver only stops tracking it. It does not delete the folder.

![Add menu with Add folder and Find more savings](media/p81-07-add-locations.jpg)

**Try it**

- Add a small folder with disposable duplicates.
- Scan and find it under Other folders.
- Deduplicate only that location.
- Remove the location and confirm that the real folder is still there.

## 9. Find more savings elsewhere

After the global scan, choose **Add → Find more savings** to search your Home folder, another folder, or another drive. Set a minimum size, review the suggestions, and add only the locations you want.

![Choose where to search dialog for Home, another folder, or a drive](media/p81-08-find-more-savings.jpg)

Hardlinks cannot cross filesystems. Think of each drive as its own deduplication island: files on one external SSD can share space with each other, but not with a file on the internal drive.

**Try it**

- Search Home and confirm that managed locations are skipped.
- Cancel a search and confirm that nothing is added.
- Search another folder and review suggestions before accepting them.
- On a hardlink-compatible external drive, deduplicate two files on that drive.
- Confirm that cross-drive matches are unavailable rather than actionable.

## 10. Scan one app

Every installed app has its own Disk Saver page. It shows the app's **Unique**, **Shared**, and **Can save** bytes, and every action stays scoped to that app.

Run the global scan first so Pinokio has a verified set of files to compare against.

![App-specific Disk Saver view for openDAW](media/p81-09-app-disk-saver.jpg)

**Try it**

- Open an app, choose Disk Saver, and scan it.
- Change its minimum-size setting.
- Check the Unique / Shared / Can save summary.
- Deduplicate from this page and confirm that unrelated apps are untouched.

## 11. Check apps automatically

Set an app's Disk Saver control to **Auto** or **Manual**. In Auto mode, Pinokio watches which files the app changes, then checks eligible files after the app stops.

If it finds verified duplicates, the control shows **New**. Opening the result clears that indicator. Auto mode never deduplicates by itself—you still review the files and choose the action.

![Disk Saver Auto mode in an app sidebar](media/p81-11-automatic-app-checking.jpg)

**Try it**

- Switch between Auto and Manual, then reopen the app page.
- In Auto mode, let the app create or download a large duplicate and then stop it.
- Confirm that **New** appears only after Pinokio finds a verified match.
- Open the result and confirm that **New** clears.
- Confirm that Manual mode does not run the automatic check.

## 12. Review activity and partial failures

Activity records successful deduplication, separation, and cleanup, including file counts, sizes, and times. It is an audit trail, not an undo button; use **Make separate** to reverse deduplication.

![Disk Saver activity history](media/p81-10-activity.jpg)

**Try it**

- Perform one action of each kind and find all three in Activity.
- Search Activity and return later to confirm that entries remain.
- Scan a harmless unreadable test folder and check that the affected path is listed.
- Cancel a long action and confirm that unfinished files are not reported as successful.

# Powerful use cases

Disk Saver helps most when large, mostly read-only files have been copied because different tools expect their own folder layouts.

## Keep app installs disposable without wasting space

Normally you must choose:

- Give every app its own models. Uninstalling is simple, but storage is repeated.
- Put models in a central cache or shared folder. Storage is shared, but the models no longer belong to any one app.

Disk Saver separates the path from the storage. Each app still sees a normal file in its own folder, while identical files can share the same physical data.

**Example**

1. App A downloads `model.safetensors` into its own folder.
2. App B downloads the identical model into its folder.
3. Disk Saver verifies both and makes them share one physical copy.
4. Delete App A. Its folder disappears; App B keeps working.
5. Delete App B. Its path disappears too. The final private link appears under **Unused files**, where you can safely clean it up.

| Approach | App paths | Storage | Delete one app | Make one app independent |
|---|---|---|---|---|
| Separate copies | Inside each app | Repeated | Deletes its copy | Already independent |
| Shared folder, symlinks, or cache | Points to a central location | Shared | Leaves the central model | Copy and reconfigure |
| Pinokio Disk Saver | Inside each app | Shared for identical files | Deletes only that app's path | Choose **Make separate** |

Setting `HF_HOME`, for example, chooses a shared root for the Hugging Face cache. Disk Saver takes a different approach: the app paths stay separate while verified content shares storage. See the [Hugging Face cache documentation](https://huggingface.co/docs/huggingface_hub/main/guides/manage-cache).

Hardlinks, hashing, and deduplication are established techniques. The useful part is how Pinokio brings them together: automatic discovery, exact-content checks, app-local paths, selective actions, **Make separate**, and safe cleanup.

## One model, many AI apps

ComfyUI, InvokeAI, image generators, trainers, audio tools, and custom launchers may all download the same checkpoint.

If three files contain the same 17.24 GB model, they can keep all three paths while using one physical copy—saving about 34.48 GB. Names do not need to match; the contents do.

## Old Pinokio Homes and rollback copies

Folders such as `pinokio-old`, `pinokio-working`, and a fresh Pinokio Home are useful during an upgrade, but their repeated models and runtimes are expensive.

Add the old folders and deduplicate their stable overlap. Each directory tree remains complete for rollback. If an old Home is on another drive, it can only share space with files on that drive.

## Python environments and runtimes

Apps often install the same PyTorch wheels, CUDA libraries, Python packages, Node or Electron binaries, Rust toolchains, FFmpeg builds, and browser runtimes.

Ten environments containing the same 200 MB library can share one copy and save about 1.8 GB—without merging the environments or changing imports.

## Hugging Face and app caches

A model may exist in the Hugging Face cache and again inside several apps. Add the cache, scan it with Pinokio Home, and review exact matches.

This helps when symlinks would confuse an installer or an app insists on its own path.

## Forks, worktrees, and experiments

Copying a working project is a quick way to start an experiment. The source code is usually small; copied environments, models, test data, and build artifacts are not.

Keep every experiment self-contained while unchanged files share storage. Use **Make separate** before editing a shared file in place.

## Downloads, installers, and archives

Download folders collect repeated `.zip`, `.tar`, `.dmg`, `.pkg`, model, and dataset files—often under different names. These are good candidates because they rarely change.

Add the archive folders as they are. Disk Saver keeps their structure and only offers exact matches.

## Datasets and media libraries

Training data, stock assets, sound libraries, textures, footage, and exports often get copied into several projects.

Deduplicate finalized or read-only assets. Keep databases, active project files, and media that an editor rewrites separate—or separate them before editing.

## Build farms and development caches

Branches and apps can repeat entire dependency trees and toolchains. Start with a **100 MB** or **500 MB** scan to catch the large native binaries, then lower the limit if the extra scan time is worthwhile.

## Portable workspaces on external SSDs

An SSD may hold several self-contained AI workspaces. Add its folders and deduplicate files within that drive. The paths remain portable and the space is saved on the SSD.

The drive must use a filesystem that supports hardlinks. FAT-family filesystems generally do not.

## Find duplicates without changing them

You can use Disk Saver as an inventory: scan, search, compare paths, and inspect exclusions without deduplicating anything.

That is useful for finding accidental downloads, explaining why a migration doubled in size, or seeing which app owns a large file.

## Clean up after uninstalling apps

Deleting an app removes its folder and model paths. If another app still links to the same content, that app keeps working. After the final app path is gone, the verified private link may appear under **Unused files** for cleanup.

You stay in control of that last deletion, and Activity records it.

# How Disk Saver works

1. **Inventory:** Scan the selected locations without following symbolic links.
2. **Filter:** Use size, filesystem, metadata, and file identity to find likely matches.
3. **Verify:** Hash candidates with SHA-256. Only byte-identical files qualify.
4. **Review:** Show Duplicates, Cannot deduplicate, Deduplicated, and No action needed. Nothing changes yet.
5. **Deduplicate:** After you approve, replace redundant storage with a hardlink on the same filesystem.
6. **Separate:** Copy a linked path back to an independent file.
7. **Clean up:** Remove a private link only when it is unchanged and no managed path uses it.

## What a hardlink means

A hardlink is another name for the same physical file data—not a shortcut. Every path behaves like a normal file. Deleting one path leaves the data available through the others.

There is one important caution: if an app changes the bytes **in place**, every hardlink sees that change. Models, archives, runtimes, and other read-only files are ideal. Use **Make separate** before editing.

Many apps save by writing a new temporary file and renaming it over the old one. That naturally gives the changed path its own data, but not every app works this way.

## Safety checks

Before changing a path, Disk Saver checks it again. It skips files that changed after the scan, belong to a running Pinokio app, have incompatible metadata, are unavailable, or live on an unsupported or different filesystem.

Actions use temporary files and atomic replacement where possible. Completed work appears in Activity; failed or unprocessed files stay visible and untouched.

# What to deduplicate

| Strong candidates | Keep separate or use caution |
|---|---|
| Models and checkpoints | Databases and virtual disks |
| Installers and archives | Logs and frequently rewritten caches |
| Python wheels and native libraries | Active files edited in place |
| Runtime and browser binaries | Independent backup copies |
| Finalized datasets and media | Files on different drives |
| Old app or Pinokio Home copies | Similar files whose bytes differ |

Files must match exactly. Two models with the same architecture, two videos that look identical, or two archives containing the same files do not qualify unless every byte matches.

# A safe five-minute test

1. Create a temporary folder on the same drive as Pinokio Home.
2. Put two byte-identical disposable files in it. A large model or archive makes the result easy to see.
3. Add the folder to Disk Saver and scan below the test file's size.
4. Select one copy under Duplicates and deduplicate it.
5. Open both paths and compare their checksums.
6. Choose **Make separate** and check both files again.
7. Delete the test files normally, then check **Unused files** for anything reclaimable.

# Frequently asked questions

## Does Disk Saver delete duplicate files?

No. Deduplication keeps every selected path and removes only redundant physical storage. Cleanup removes unused private links after safety checks.

## Do names or paths change?

No. Apps keep using the same paths.

## Does deleting one hardlink delete the others?

No. It removes that one path. The data remains while another hardlink exists. Editing the bytes in place is different, so separate writable files first.

## What happens when I delete an app?

The app's folder and model paths are deleted. Other app paths keep working. When the final app path is gone, the private Disk Saver link can appear under **Unused files**; **Clean up** removes it after checking that nothing depends on it.

That gives you app-by-app uninstall behavior without requiring a permanent central model library.

## Can it deduplicate across drives?

No. Hardlinks cannot cross filesystem boundaries. Disk Saver can manage several drives, but files only share storage with compatible files on the same drive.

## Why is an identical file under Cannot deduplicate?

The contents match, but another safety check failed. The row will name the reason, such as permissions, ownership, hardlink support, different drives, denied access, or a reference that could not be verified.

## Is a scan destructive?

No. A scan reads metadata and hashes possible matches. Only **Deduplicate**, **Make separate**, and **Clean up** change files.

## Is this a backup?

No. Deduplication saves local space; it does not create an independent copy. Keep a real backup on separate storage, and check whether your backup software preserves or expands hardlinks.

## Can I stop using Disk Saver?

Yes. Use **Make separate** for files that should become independent. Removing an added location stops tracking it but does not delete its files.

# Feedback

When reporting a problem, include your operating system, filesystem, minimum file size, the affected view, any reason shown, and whether the source app was running. Screenshots of the exclusions notice or Activity entry are helpful.

Join the [Pinokio Discord](https://discord.gg/TQdNwadtE4) or follow [Pinokio updates](https://x.com/cocktailpeanut).
