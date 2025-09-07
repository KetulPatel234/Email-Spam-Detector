# -*- mode: python ; coding: utf-8 -*-


a = Analysis(
    ['run.py'],
    pathex=[],
    binaries=[],
    datas=[('static', 'static'), ('.env', '.env'), ('app/model.pkl', 'app')],
    hiddenimports=['sklearn', 'sklearn.pipeline', 'sklearn.model_selection', 'sklearn.naive_bayes', 'sklearn.feature_extraction', 'sklearn.feature_extraction.text'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='run',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
