<template>
  <div id="app" class="pl-10 h-screen">
    <form method="post" enctype="multipart/form-data" class="form">
      <input type="file" ref="files" name="file" @change="uploadFile" />
    </form>
    <form method="post" enctype="multipart/form-data" class="form">
      <input
        type="file"
        multiple="multiple"
        ref="multipleFiles"
        name="file"
        @change="uploadMultipleFiles"
      />
    </form>
    <div>
      <button
        @click="clickOnButton"
        class="
          flex
          items-center
          space-x-2
          p-3
          bg-blue-400
          hover:bg-blue-500
          transition
          text-white
        "
      >
        <span>Загрузить один файл</span>
        <i class="ri-links-line" />
      </button>
    </div>
    <div
      ref="wrapper"
      class="wrapper relative w-96"
      v-if="singlefile && singlefile.name"
    >
      <i
        class="
          ri-close-line
          absolute
          top-2
          right-2
          text-3xl
          cursor-pointer
          hover:text-red-500
          transition
        "
        @click="singlefile = null"
      />
      <p class="p-2 px-6 bg-blue-500 text-white">
        Имя файла : {{ singlefile.name }}
      </p>
      <img :src="singlefile.link" />
      <button
        @click="downloadFile(singlefile.name)"
        class="
          flex
          items-center
          justify-center
          space-x-2
          p-1
          bg-blue-400
          hover:bg-blue-500
          transition
          text-white
          w-full
        "
      >
        <span>Скачать файл</span>
      </button>
    </div>
    <div>
      <button
        @click="clickOnMultipleFilesButton"
        class="
          mt-6
          flex
          items-center
          space-x-2
          p-3
          bg-blue-400
          hover:bg-blue-500
          transition
          text-white
        "
      >
        <span>Загрузить несколько файлов</span>
        <i class="ri-links-line" />
      </button>
    </div>
    <div v-if="multipleFiles.length" class="flex items-end mt-3">
      <span class="mr-3"> Файлы: </span>
      <span
        v-for="(file, index) in multipleFiles"
        :key="index"
        class="flex items-center"
      >
        <a
          class="font-bold hover:text-blue-400 transition"
          :href="file.link"
          @click.prevent="downloadFile(file.name)"
          >{{ file.name }}{{ index === multipleFiles.length - 1 ? "" : ";" }}
        </a>
        <i
          class="ri-close-line hover:text-red-500 cursor-pointer transition"
          @click="deleteLinkFromMultipleFiles(index)"
        />
      </span>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    singlefile: null,
    multipleFiles: [],
  }),
  methods: {
    clickOnButton() {
      this.$refs.files.click();
    },
    clickOnMultipleFilesButton() {
      this.$refs.multipleFiles.click();
    },
    deleteLinkFromMultipleFiles(index) {
      this.multipleFiles = this.multipleFiles.filter(
        (link, idx) => index !== idx
      );
    },
    async uploadFile() {
      const formData = new FormData();
      formData.append("file", this.$refs.files.files[0]);
      const { data } = await this.axios.post(
        "http://localhost:3000/upload",
        formData
      );
      this.singlefile = {
        name: data.filename,
        link: `http://localhost:3000/static/images/${data.filename}`,
      };
    },
    async uploadMultipleFiles() {
      const formData = new FormData();
      formData.append("file", this.$refs.multipleFiles.files[0]);
      const { data } = await this.axios.post(
        "http://localhost:3000/upload",
        formData
      );
      this.multipleFiles.push({
        name: data.filename,
        link: `http://localhost:3000/static/images/${data.filename}`,
      });
    },
    async downloadFile(file) {
      const res = await fetch(`http://localhost:3000/download?file=${file}`);
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = file + ".jpg";
      link.click();
    },
  },
};
</script>

<style>
img {
  max-width: 100%;
  height: auto;
  object-fit: cover;
}
.form {
  visibility: hidden;
}
</style>
