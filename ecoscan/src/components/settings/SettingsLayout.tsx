import { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { SECTIONS } from '@/context/SettingsTypes';
import { SettingsSearch } from './SettingsSearch';
import { SettingsNav } from './SettingsNav';
import { UnsavedBar } from './UnsavedBar';
import { SettingsIndex } from '@/pages/settings/SettingsIndex';

export function SettingsLayout({ children: _children }: { children?: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDirty, dirtyFields, setDirty, clearDirtyField, showToast } = useSettings();
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ section: string; key: string; label: string; description: string }>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile && location.pathname === '/settings') {
      return;
    }
    if (!isMobile && location.pathname === '/settings') {
      navigate('/settings/profile', { replace: true });
    }
  }, [isMobile, location.pathname, navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const activeEl = document.activeElement;
        if (activeEl?.tagName !== 'INPUT' && activeEl?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
      if (e.key === 'Escape') {
        setSearchQuery('');
        setShowSearchResults(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    const query = searchQuery.toLowerCase();
    const results = SECTIONS.flatMap((section) => {
      const matchesSection = section.label.toLowerCase().includes(query) || section.description.toLowerCase().includes(query);
      if (matchesSection) {
        return [{ section: section.key, key: section.key, label: section.label, description: section.description }];
      }
      return [];
    });
    setSearchResults(results.slice(0, 10));
    setShowSearchResults(results.length > 0);
  }, [searchQuery]);

  const handleSearchResultClick = (sectionKey: string) => {
    setSearchQuery('');
    setShowSearchResults(false);
    searchInputRef.current?.blur();
    navigate(`/settings/${sectionKey}`);
    if (contentRef.current) {
      contentRef.current.classList.add('highlight-flash');
      setTimeout(() => contentRef.current?.classList.remove('highlight-flash'), 1500);
    }
  };

  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    if (isDirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  }, [isDirty]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [handleBeforeUnload]);

  const isSettingsRoute = location.pathname.startsWith('/settings/') && location.pathname !== '/settings';
  const currentSection = location.pathname.replace('/settings/', '').split('/')[0];

  return (
    <div className="min-h-screen bg-bg flex">
      {!isMobile && (
        <aside className="w-[260px] shrink-0 border-r border-line bg-bg-surface flex flex-col h-dvh sticky top-0">
          <div className="p-4 border-b border-line shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-semibold text-fg">Settings</span>
              <span className="text-fg-dim text-xs uppercase tracking-wider hidden sm:inline">SETTINGS</span>
            </div>
            <SettingsSearch
              ref={searchInputRef}
              value={searchQuery}
              onChange={setSearchQuery}
              onFocus={() => setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              results={searchResults}
              showResults={showSearchResults}
              onResultClick={handleSearchResultClick}
            />
          </div>
          <nav className="flex-1 overflow-y-auto p-3" aria-label="Settings navigation">
            <SettingsNav />
          </nav>
        </aside>
      )}

      <div className="flex-1 min-w-0">
        <main className="max-w-3xl mx-auto w-full px-4 py-8" ref={contentRef}>
          {isMobile && location.pathname === '/settings' && (
            <SettingsIndex onNavigate={navigate} />
          )}

          {isSettingsRoute && (
            <div className="animate-fade-in-up">
              <header className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => navigate('/settings')}
                    className="hover-solid p-1.5 rounded-lg text-fg-dim hover:text-fg"
                    aria-label="Back to Settings"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <nav className="flex items-center gap-1.5 text-xs text-fg-dim" aria-label="Breadcrumb">
                    <a href="/" className="hover:text-fg">Home</a>
                    <span>/</span>
                    <a href="/settings" className="hover:text-fg">Settings</a>
                    <span>/</span>
                    <span className="text-fg capitalize">{currentSection}</span>
                  </nav>
                </div>
                <div>
                  <h1 className="font-display text-3xl font-normal tracking-tight text-fg">{SECTIONS.find(s => s.key === currentSection)?.label ?? 'Settings'}</h1>
                  <p className="mt-1 text-fg-muted">{SECTIONS.find(s => s.key === currentSection)?.description}</p>
                </div>
              </header>
              <Outlet />
            </div>
          )}

          {!isSettingsRoute && !isMobile && location.pathname === '/settings' && (
            <div className="text-center py-12">
              <p className="text-fg-muted">Select a section from the sidebar to get started.</p>
            </div>
          )}
        </main>

        {isDirty && (
          <UnsavedBar
            onSave={() => {
              setDirty(false);
              showToast('Changes saved', 'success');
            }}
            onDiscard={() => {
              Object.keys(dirtyFields).forEach(clearDirtyField);
              setDirty(false);
            }}
          />
        )}
      </div>
    </div>
  );
}