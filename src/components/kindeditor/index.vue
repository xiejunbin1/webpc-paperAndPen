<template>
<div class="margin-top-20">
    <textarea :id="id" name="content" v-model="outContent"></textarea>
</div>
</template>

<script>
import "kindeditor/themes/default/default.css";
import "kindeditor/kindeditor-all-min.js";
import "kindeditor/lang/zh-CN.js";

// 以下四个配置文件见下文

import items from "./config/items";
import htmlTags from "./config/htmlTags";
import fontSizeTable from "./config/fontSizeTable";
import otherConfig from "./config/otherConfig";
import axios from 'axios'
export default {
    name: "kindeditor-component",
    props: {
        // 编辑器内容 url
        html: {
            type: String,
            default: ""
        },
        // 编辑器内容
        content: {
            type: String,
            default: ""
        },
        // 编辑器id
        id: {
            type: String,
            // required: true,
            default: "kindeditor-id"
        },
        // 宽
        width: {
            type: String,
            default: `100%`
        },
        // 高
        height: {
            type: String,
            default: "400"
        },
        // 最小宽
        minWidth: {
            type: Number,
            default: 650
        },
        // 最小高
        minHeight: {
            type: Number,
            default: 400
        },
        // toolbar 工具栏配置
        items: {
            type: Array,
            default: function () {
                return [...items];
            }
        },
        // 标签配置
        htmlTags: {
            type: Object,
            default: function () {
                return {
                    ...htmlTags
                };
            }
        },
        //字号配置
        fontSizeTable: {
            type: Array,
            default: function () {
                return [...fontSizeTable];
            }
        },
        // 语言配置
        langType: {
            type: String,
            default: "zh-CN"
        },
        // 主题配置
        themeType: {
            type: String,
            default: "default"
        },
        // body 的样式
        bodyClass: {
            type: String,
            default: "ke-content"
        },
        // 其他配置项
        ...otherConfig
    },
    data() {
        return {
            editor: null,
            outContent: this.content
        };
    },

    watch: {
        content(val) {
            this.editor && val !== this.outContent && this.editor.html(val)
        },
        outContent(val) {
            this.$emit('update:content', val)
            this.$emit('on-content-change', val)
        },
        // 初始化编辑器内容
        html(val) {
            if (
                this.html &&
                (this.html.startsWith('https://') || this.html.startsWith('http://'))
            ) {
                this.loadUrl(val)
            } else {
                this.outContent = ''
                this.outContent ? this.editor.appendHtml(this.outContent) : ''
            }
        }
    },

    mounted() {
        this.initEditor()
    },

    methods: {
        // 初始化编辑器
        initEditor() {
            this.editor = window.KindEditor.create("#" + this.id, {
                width: this.width,
                height: this.height,
                minWidth: this.minWidth,
                minHeight: this.minHeight,
                items: this.items,
                noDisableItems: this.noDisableItems,
                filterMode: this.filterMode,
                htmlTags: this.htmlTags,
                wellFormatMode: this.wellFormatMode,
                resizeType: this.resizeType,
                themeType: this.themeType,
                langType: this.langType,
                designMode: this.designMode,
                fullscreenMode: this.fullscreenMode,
                basePath: this.basePath,
                themesPath: this.themesPath,
                pluginsPath: this.pluginsPath,
                langPath: this.langPath,
                minChangeSize: this.minChangeSize,
                loadStyleMode: this.loadStyleMode,
                urlType: this.urlType,
                newlineTag: this.newlineTag,
                pasteType: this.pasteType,
                dialogAlignType: this.dialogAlignType,
                shadowMode: this.shadowMode,
                zIndex: this.zIndex,
                useContextmenu: this.useContextmenu,
                syncType: this.syncType,
                indentChar: this.indentChar,
                cssPath: this.cssPath,
                cssData: this.cssData,
                bodyClass: this.bodyClass,
                colorTable: this.colorTable,
                afterCreate: this.afterCreate,
                // 编辑器内容改变回调
                afterChange: () => {
                    console.log(666666)
                    if (this.editor) {
                        this.outContent = this.editor.html()
                        this.curLength = this.outContent.length
                    } else {
                        this.outContent = ''
                    }
                    // this.editor ? (this.outContent = this.editor.html()) : "";
                },
                afterTab: this.afterTab,
                afterFocus: this.afterFocus,
                afterBlur: this.afterBlur,
                afterUpload: this.afterUpload,
                uploadJson: this.uploadJson,
                fileManagerJson: this.fileManagerJson,
                allowPreviewEmoticons: this.allowPreviewEmoticons,
                allowImageUpload: this.allowImageUpload,
                allowFlashUpload: this.allowFlashUpload,
                allowMediaUpload: this.allowMediaUpload,
                allowFileUpload: this.allowFileUpload,
                allowFileManager: this.allowFileManager,
                fontSizeTable: this.fontSizeTable,
                imageTabIndex: this.imageTabIndex,
                formatUploadUrl: this.formatUploadUrl,
                fullscreenShortcut: this.fullscreenShortcut,
                extraFileUploadParams: this.extraFileUploadParams,
                filePostName: this.filePostName,
                fillDescAfterUploadImage: this.fillDescAfterUploadImage,
                afterSelectFile: this.afterSelectFile,
                pagebreakHtml: this.pagebreakHtml,
                allowImageRemote: this.allowImageRemote,
                autoHeightMode: this.autoHeightMode,
                fixToolBar: this.fixToolBar,
                tabIndex: this.tabIndex
            });
        }
    }
};
</script>

<style>
</style>
