<template>
<div class="c-sidebar c-drawer c-drawer--align-left">
    <div class="c-sidebar__pane js-sidebar-sections">
        <div class="c-sidebar__header-w">
            <div class="c-sidebar__header">
                <span class="c-sidebar__header-label">{{ sectionTitle }}</span>
            </div>
        </div>
        <div class="c-sidebar__contents-and-controls">
            <button class="c-list-button"
                    @click="addSection"
            >
                <span class="c-button c-list-button__button icon-plus"></span>
                <span class="c-list-button__label">Add {{ sectionTitle }}</span>
            </button>
            <SectionCollection class="c-sidebar__contents"
                               :default-section-id="defaultSectionId"
                               :selected-section-id="selectedSectionId"
                               :domain-object="domainObject"
                               :sections="sections"
                               :section-title="sectionTitle"
                               @defaultSectionDeleted="defaultSectionDeleted"
                               @updateSection="sectionsChanged"
                               @selectSection="selectSection"
            />
        </div>
    </div>
    <div class="c-sidebar__pane js-sidebar-pages">
        <div class="c-sidebar__header-w">
            <div class="c-sidebar__header">
                <span class="c-sidebar__header-label">{{ pageTitle }}</span>
            </div>
            <button class="c-click-icon c-click-icon--major icon-x-in-circle"
                    @click="toggleNav"
            ></button>
        </div>

        <div class="c-sidebar__contents-and-controls">
            <button class="c-list-button"
                    @click="addPage"
            >
                <span class="c-button c-list-button__button icon-plus"></span>
                <span class="c-list-button__label">Add {{ pageTitle }}</span>
            </button>
            <PageCollection ref="pageCollection"
                            class="c-sidebar__contents"
                            :default-page-id="defaultPageId"
                            :selected-page-id="selectedPageId"
                            :domain-object="domainObject"
                            :pages="pages"
                            :sections="sections"
                            :sidebar-covers-entries="sidebarCoversEntries"
                            :page-title="pageTitle"
                            @defaultPageDeleted="defaultPageDeleted"
                            @toggleNav="toggleNav"
                            @updatePage="pagesChanged"
                            @selectPage="selectPage"
            />
        </div>
    </div>
</div>
</template>

<script>
import SectionCollection from './SectionCollection.vue';
import PageCollection from './PageCollection.vue';
import uuid from 'uuid';

export default {
    components: {
        SectionCollection,
        PageCollection
    },
    inject: ['openmct'],
    props: {
        defaultPageId: {
            type: String,
            default() {
                return '';
            }
        },
        selectedPageId: {
            type: String,
            default() {
                return '';
            }
        },
        defaultSectionId: {
            type: String,
            default() {
                return '';
            }
        },
        selectedSectionId: {
            type: String,
            default() {
                return '';
            }
        },
        domainObject: {
            type: Object,
            default() {
                return {};
            }
        },
        pageTitle: {
            type: String,
            default() {
                return '';
            }
        },
        sections: {
            type: Array,
            required: true,
            default() {
                return [];
            }
        },
        sectionTitle: {
            type: String,
            default() {
                return '';
            }
        },
        sidebarCoversEntries: {
            type: Boolean,
            default() {
                return false;
            }
        }
    },
    computed: {
        pages() {
            const selectedSection = this.sections.find(section => section.id === this.selectedSectionId);

            return selectedSection && selectedSection.pages || [];
        }
    },
    watch: {
        pages(newPages) {
            if (!newPages.length) {
                this.addPage();
            }
        },
        sections(newSections) {
            if (!newSections.length) {
                this.addSection();
            }
        }
    },
    mounted() {
        if (!this.sections.length) {
            this.addSection();
        }
    },
    methods: {
        addPage() {
            const newPage = this.createNewPage();
            const pages = this.addNewPage(newPage);

            this.pagesChanged({
                pages,
                id: newPage.id
            });
            this.$emit('selectPage', newPage.id);
        },
        addSection() {
            const newSection = this.createNewSection();
            const sections = this.addNewSection(newSection);

            this.sectionsChanged({
                sections,
                id: newSection.id
            });

            this.$emit('selectSection', newSection.id);
        },
        addNewPage(page) {
            const pages = this.pages.map(p => {
                p.isSelected = false;

                return p;
            });

            return pages.concat(page);
        },
        addNewSection(section) {
            const sections = this.sections.map(s => {
                s.isSelected = false;

                return s;
            });

            return sections.concat(section);
        },
        createNewPage() {
            const pageTitle = this.pageTitle;
            const id = uuid();

            return {
                id,
                isDefault: false,
                isSelected: true,
                name: `Unnamed ${pageTitle}`,
                pageTitle
            };
        },
        createNewSection() {
            const sectionTitle = this.sectionTitle;
            const id = uuid();
            const page = this.createNewPage();
            const pages = [page];

            return {
                id,
                isDefault: false,
                isSelected: true,
                name: `Unnamed ${sectionTitle}`,
                pages,
                sectionTitle
            };
        },
        defaultPageDeleted() {
            this.$emit('defaultPageDeleted');
        },
        defaultSectionDeleted() {
            this.$emit('defaultSectionDeleted');
        },
        toggleNav() {
            this.$emit('toggleNav');
        },
        pagesChanged({ pages, id }) {
            this.$emit('pagesChanged', {
                pages,
                id
            });
        },
        selectPage(pageId) {
            this.$emit('selectPage', pageId);
        },
        selectSection(sectionId) {
            this.$emit('selectSection', sectionId);
        },
        sectionsChanged({ sections, id }) {
            this.$emit('sectionsChanged', {
                sections,
                id
            });
        }
    }
};
</script>
