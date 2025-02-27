<template>
<ul>
    <li class="c-tree__item menus-to-left"
        :class="isAliasClass"
    >
        <span class="c-disclosure-triangle is-enabled flex-elem"
              :class="expandedCssClass"
              @click="toggleExpanded"
        >
        </span>
        <div class="c-object-label"
             :class="statusClass"
        >
            <div class="c-object-label__type-icon"
                 :class="getSeriesClass"
            >
                <span class="is-status__indicator"
                      title="This item is missing or suspect"
                ></span>
            </div>
            <div class="c-object-label__name">{{ series.domainObject.name }}</div>
        </div>
    </li>
    <li v-show="expanded"
        class="c-tree__item menus-to-left"
    >
        <ul class="grid-properties js-plot-options-browse-properties">
            <li class="grid-row">
                <div class="grid-cell label"
                     title="The field to be plotted as a value for this series."
                >Value</div>
                <div class="grid-cell value">
                    {{ yKey }}
                </div>
            </li>
            <li class="grid-row">
                <div class="grid-cell label"
                     title="The rendering method to join lines for this series."
                >Line Method</div>
                <div class="grid-cell value">{{ {
                    'none': 'None',
                    'linear': 'Linear interpolation',
                    'stepAfter': 'Step After'
                }[interpolate] }}
                </div>
            </li>
            <li class="grid-row">
                <div class="grid-cell label"
                     title="Whether markers are displayed, and their size."
                >Markers</div>
                <div class="grid-cell value">
                    {{ markerOptionsDisplayText }}
                </div>
            </li>
            <li class="grid-row">
                <div class="grid-cell label"
                     title="Display markers visually denoting points in alarm."
                >Alarm Markers</div>
                <div class="grid-cell value">
                    {{ alarmMarkers ? "Enabled" : "Disabled" }}
                </div>
            </li>
            <li class="grid-row">
                <div class="grid-cell label"
                     title="Display lines visually denoting alarm limits."
                >Limit lines</div>
                <div class="grid-cell value">
                    {{ limitLines ? "Enabled" : "Disabled" }}
                </div>
            </li>
            <ColorSwatch :current-color="seriesHexColor"
                         edit-title="Manually set the plot line and marker color for this series."
                         view-title="The plot line and marker color for this series."
                         short-label="Color"
            />
        </ul>
    </li>
</ul>
</template>

<script>
import ColorSwatch from "@/plugins/plot/ColorSwatch.vue";

export default {
    components: {
        ColorSwatch
    },
    inject: ['openmct', 'domainObject', 'path'],
    props: {
        series: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            expanded: false
        };
    },
    computed: {
        isAliasClass() {
            let cssClass = '';
            const domainObjectPath = [this.series.domainObject, ...this.path];
            if (this.openmct.objects.isObjectPathToALink(this.series.domainObject, domainObjectPath)) {
                cssClass = 'is-alias';
            }

            return cssClass;
        },
        getSeriesClass() {
            let cssClass = '';
            let type = this.openmct.types.get(this.series.domainObject.type);
            if (type.definition.cssClass) {
                cssClass = `${cssClass} ${type.definition.cssClass}`;
            }

            return cssClass;
        },
        expandedCssClass() {
            if (this.expanded === true) {
                return 'c-disclosure-triangle--expanded';
            }

            return '';
        },
        statusClass() {
            return (this.status) ? `is-status--${this.status}` : '';
        },
        yKey() {
            return this.series.get('yKey');
        },
        interpolate() {
            return this.series.get('interpolate');
        },
        markerOptionsDisplayText() {
            return this.series.markerOptionsDisplayText();
        },
        alarmMarkers() {
            return this.series.get('alarmMarkers');
        },
        limitLines() {
            return this.series.get('limitLines');
        },
        seriesHexColor() {
            return this.series.get('color').asHexString();
        }
    },
    mounted() {
        this.status = this.openmct.status.get(this.series.domainObject.identifier);
        this.removeStatusListener = this.openmct.status.observe(this.series.domainObject.identifier, this.setStatus);
    },
    beforeDestroy() {
        if (this.removeStatusListener) {
            this.removeStatusListener();
        }
    },
    methods: {
        toggleExpanded() {
            this.expanded = !this.expanded;
        },
        setStatus(status) {
            this.status = status;
        }
    }
};
</script>
