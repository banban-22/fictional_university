<?php
function greet($name, $color){
    echo "<p>Hello, my name is $name and my favorite color is $color</p>";
}

greet('John', 'blue');
greet('Jane', 'green');
?>

<h1><?php bloginfo('name'); ?></h1>
<p><?php bloginfo('description'); ?></p>

<?php
$myName = "Brad";
$names = array('Brad', 'John', 'Jane');

$count = 0;

while($count < count($names)) {
    echo "<li>Hi, my name is $names[$count]</li>";
    $count++;
}
// $count = 1;
// while ($count < 100){
//     echo "<li>$count</li>";
//     $count++;
// }
?>

<p>Hi, my name is <?php echo $myName; ?></p>
<p>Hi, my name is <?php echo $names[2]; ?></p>