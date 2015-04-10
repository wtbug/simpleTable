# simpleTable
simpleTable use native javascript make a simple wrapper. Use simpleTable can quick draw a HTML table. 
If in a small project, just display data in HTML table and do not want to load bigger javascript plug-in, then can use simpleTable.

Easy use simpleTable:
a function call to initialise the table.

### HTML:
```
<table id="myTable"></table>
```

### JavaScript:
```
<script>
    simpleTable.quickDraw('myTable');
</script>
```

# Data Source #
## 1.JSON Example ##
###JSON File:###
    {"data": [{"a":"NameA"},{"b":"NameB"}]}
###HTML:###
    ```
    <table id="myTable"></table>
    ```
###JavaScript:###
    ```
    var table = simpleTable.quickDraw('myTable');
    simpleTable.reDraw(table,'json.txt');
    ```
    
## 2.DOM Example ##
###HTML###
    <table id="myTable">
        <thead>
            <tr>
                <th>Id</th>
                <th>Name</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>Jack</td>
            </tr>
            <tr>
                <td>2</td>
                <td>Luck</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <th>Id</th>
                <th>Name</th>
            </tr>
        </tfoot>
    </table>
###JavaScript:###
    ```
    simpleTable.quickDraw('myTable');
    ```