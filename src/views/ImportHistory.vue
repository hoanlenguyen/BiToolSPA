<template>
  <section class="section is-main-section">
    <b-table
      :data="data"
      :loading="isLoading"
      
      backend-pagination
      :total="totalItems"
      :per-page="filter.rowsPerPage"      
      :pagination-simple="false"
      pagination-position="bottom"
      
      backend-sorting
      default-sort="ID"
      default-sort-direction="desc"
      :sort-icon="sortIcon"
      :sort-icon-size="sortIconSize"
      @sort="onSort"

      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"           
      :pagination-order="paginationOrder"   
      :debounce-page-input="200"
    >
      <b-table-column
        field="id"
        label="ID"
        width="40"
        numeric
        v-slot="props"
      >
        {{ props.row.id }}
      </b-table-column>

      <b-table-column
        field="ImportTime"
        label="Import Time"
        sortable        
        searchable
      >
      <template #searchable="props">
       <b-field>
          <p class="control">
            <b-datepicker
              icon="calendar-today"
              locale="en-CA"
              v-model="importTimeFrom"
              editable
              size="is-small"
              placeholder="from"
              @input="onChangePageSize"
            ></b-datepicker>
          </p>
          <p class="control ml-2">
            <b-datepicker
              icon="calendar-today"
              locale="en-CA"
              v-model="importTimeTo"
              editable
              size="is-small"
              placeholder="to"
              @input="onChangePageSize"
            ></b-datepicker>
          </p>
        </b-field>
      </template>
      <template v-slot="props">{{ props.row.importTime | dateTime }}</template>
      </b-table-column>

      <b-table-column
        field="Source"
        label="Source"
        searchable 
        sortable>
        <template #searchable="props">
          <b-input
            lazy
            icon-right-clickable
            :maxlength="50"
            :has-counter="false"
            v-model="filter.source"
            @icon-right-click="onChangePageSize"
            @keyup.native.enter="onChangePageSize"
            placeholder="Search..."
            icon-right="magnify"
            size="is-small" />
        </template>
        <template v-slot="props">{{ props.row.source }}</template>        
      </b-table-column>

      <b-table-column
        field="FileName"
        label="File Name"
        sortable
        v-slot="props"
      >
        {{props.row.fileName}}
      </b-table-column>

      <b-table-column
        field="TotalRows"
        label="Number of data"
        v-slot="props"
      >
        {{props.row.totalRows}}
      </b-table-column>
      <div slot="footer" class="columns" >
        <div class="column">
          <b-button
            label="Reset"
            type="is-light"
            class="mr-3"
            icon-left="reload"
            @click="resetFilter"
          />
        </div>
        <div class="column is-2">
          <b-select v-model="filter.rowsPerPage"  @input="onChangePageSize" class="is-align-self-flex-end">
            <option v-for="i in pageOptions" :value="i" :key="i">{{`${i} per page`}}</option>        
          </b-select>
        </b-select>
      </div>
        <div class="column is-4">
        <b-pagination
            :total="totalItems"
            v-model="filter.page"
            :range-before="1"
            :range-after="1"
            :order="`is-right`"
            :size="``"
            :simple="false"
            :rounded="false"
            :per-page="filter.rowsPerPage"
            :icon-prev="`chevron-left`"
            :icon-next="`chevron-right`"
            aria-next-label="Next page"
            aria-previous-label="Previous page"
            aria-page-label="Page"
            aria-current-label="Current page"
            :page-input="true"
            :page-input-position="``"
            :debounce-page-input="``"
            @change="onChangePageNumber"
            >
        </b-pagination>
        </div>
      </div>
    </b-table>
  </section>
</template>
<script>
import moment from "moment";
import { getPagingImportHistories, getResource  } from "@/api/importHistory";
export default {
  created() {
    this.getImportHistories();
  },
  data() {
    return {
      data: [],
      totalItems:0,
      isLoading:false,
      isPaginationSimple: false,
      isPaginationRounded: false,
      paginationPosition: "bottom",
      defaultSortDirection: "desc",
      sortIcon: "arrow-up",
      sortIconSize: "is-small",
      currentPage: 1,
      hasInput: false,
      paginationOrder: "is-right",
      inputPosition: "is-input-left",
      inputDebounce: "",
      pageOptions:[10,15,20,50],
      importTimeFrom:null,
      importTimeTo:null,
      filter:{
        page:1,
        rowsPerPage:10,
        sortBy:'ImportTime',
        sortDirection:'desc',
        importTimeFrom:null,
        importTimeTo:null,
        source: null
      },
      defaultFilter:{
        page:1,
        rowsPerPage:10,
        sortBy:'ImportTime',
        sortDirection:'desc',
        importTimeFrom:null,
        importTimeTo:null,
        source: null
      }
    };
  },
  watch: {},
  methods: {
    resetFilter() {
      this.filter = { ...this.defaultFilter };
      this.importTimeFrom=null;
      this.importTimeTo=null;
      this.getImportHistories();
    },
    onChangePageSize(){
      this.filter.page = 1;
      this.getImportHistories();
    },
    onChangePageNumber(page){
      //console.log(this.filter.page);
      //console.log(page);
      this.getImportHistories();
    }, 
    onSort(field, order) {
      //console.log('field'+field);
      //console.log('order'+order);
      this.filter.sortBy = field
      this.filter.sortDirection = order
      this.getImportHistories()
    },
    getImportHistories() {
      this.isLoading = true;
      const outputFormat = "YYYY-MM-DD";
      this.filter.importTimeFrom =this.importTimeFrom? moment(this.importTimeFrom).format(outputFormat):null;
      this.filter.importTimeTo =this.importTimeTo? moment(this.importTimeTo).format(outputFormat):null;
      if(!this.filter.source) this.filter.source=null;

      getPagingImportHistories(this.filter)
        .then((response) => {
          if (response.status == 200 && response.data) {
            const result =  response.data;
            this.totalItems= result.totalItems;
            this.data= result.items;
            //console.log(object);
            //this.customerList = response.data;
            //console.log(this.customerList);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  }
};
</script>
