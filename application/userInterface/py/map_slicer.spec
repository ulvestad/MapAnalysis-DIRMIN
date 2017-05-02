# -*- mode: python -*-

block_cipher = None


a = Analysis(['map_slicer.py'],
             pathex=['D:\\Skole\\DIRMIN\\MapAnalysis-DIRMIN\\application\\userInterface\\py'],
             binaries=[],
             datas=[],
             hiddenimports=['scipy,pillow'],
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          exclude_binaries=True,
          name='map_slicer',
          debug=False,
          strip=False,
          upx=True,
          console=True )
coll = COLLECT(exe,
               a.binaries,
               a.zipfiles,
               a.datas,
               strip=False,
               upx=True,
               name='map_slicer')
